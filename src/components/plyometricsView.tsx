import React, { useState } from 'react';
import {
  PLYOMETRIC_PHASES,
  WEEKLY_SCHEDULES,
  RED_FLAGS,
  ADVANCEMENT_CRITERIA,
  PlyoPhaseInfo,
  PlyometricExercise,
} from '../data/plyometricsData';
import { playCheckSound, playTimerAlertSound } from '../utils/audio';
import {
  Activity,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  Dumbbell,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Calculator,
  Eye,
  HeartHandshake,
} from 'lucide-react';

export const PlyometricsView: React.FC = () => {
  const [selectedPhaseNum, setSelectedPhaseNum] = useState<1 | 2 | 3>(1);
  const [activeTab, setActiveTab] = useState<'fases' | 'exercicios' | 'sessao' | 'cronograma' | 'criterios' | 'alertas'>('fases');
  const [selectedScheduleId, setSelectedScheduleId] = useState<'2_days' | '3_days'>('2_days');

  // Estado da Sessão Prática Interativa
  const [activeExerciseIdx, setActiveExerciseIdx] = useState<number>(0);
  const [completedSetsMap, setCompletedSetsMap] = useState<Record<string, boolean[]>>({});
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Estado da Calculadora de LSI (Limb Symmetry Index)
  const [healthyLegDistance, setHealthyLegDistance] = useState<string>('150');
  const [operatedLegDistance, setOperatedLegDistance] = useState<string>('130');

  // Estado do Checklist de Critérios de Avanço
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});

  // Exercício expandido para ver detalhes na aba de exercícios
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>('snap_downs_bilaterais');

  const currentPhase: PlyoPhaseInfo = PLYOMETRIC_PHASES.find((p) => p.phaseNumber === selectedPhaseNum) || PLYOMETRIC_PHASES[0];
  const currentSchedule = WEEKLY_SCHEDULES.find((s) => s.id === selectedScheduleId) || WEEKLY_SCHEDULES[0];

  // Cálculo do LSI
  const healthyDistNum = parseFloat(healthyLegDistance) || 0;
  const operatedDistNum = parseFloat(operatedLegDistance) || 0;
  const calculatedLSI = healthyDistNum > 0 ? ((operatedDistNum / healthyDistNum) * 100).toFixed(1) : '0';
  const lsiNum = parseFloat(calculatedLSI);

  // Timer de descanso useEffect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && restTimerSeconds !== null && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev !== null && prev <= 1) {
            playTimerAlertSound();
            setIsTimerRunning(false);
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTimerSeconds]);

  const handleStartRestTimer = (seconds: number) => {
    setRestTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const handleToggleSetComplete = (exerciseId: string, setIndex: number, totalSets: number, restSeconds: number) => {
    const currentSets = completedSetsMap[exerciseId] || new Array(totalSets).fill(false);
    const updated = [...currentSets];
    const willBeCompleted = !updated[setIndex];
    updated[setIndex] = willBeCompleted;

    setCompletedSetsMap((prev) => ({
      ...prev,
      [exerciseId]: updated,
    }));

    if (willBeCompleted) {
      playCheckSound();
      handleStartRestTimer(restSeconds);
    }
  };

  const handleToggleCriterion = (id: string) => {
    setCheckedCriteria((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    playCheckSound();
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Header Principal do Protocolo de Pliometria LCA */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border border-green-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            LCA + Menisco Alça de Balde (6 Meses P.O.)
          </span>
          <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border border-zinc-700">
            Retorno Seguro ao Handebol
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white leading-tight">
            Protocolo de Pliometria & Controle de Aterrissagem
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed max-w-3xl">
            Protocolo estruturado em 3 fases progressivas (2 a 3x por semana) para preencher a lacuna funcional entre o treino de força e a prática competitiva de handebol, com ênfase máxima em <strong className="text-white">absorção de impacto, controle do valgo dinâmico e proteção biológica do enxerto</strong>.
          </p>
        </div>

        {/* Mini Destaques Biomecânicos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Foco Biomecânico</span>
            <span className="text-xs font-black text-green-400">Zero Valgo + Ninja Landing</span>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Frequência Ideal</span>
            <span className="text-xs font-black text-white">2 a 3 Sessões Semanais</span>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Regra de Ouro</span>
            <span className="text-xs font-black text-amber-400">Qualidade &gt; Quantidade</span>
          </div>
        </div>
      </div>

      {/* Barra de Navegação Interna do Módulo */}
      <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('fases')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'fases'
              ? 'bg-green-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          3 Fases do Protocolo
        </button>

        <button
          onClick={() => setActiveTab('exercicios')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'exercicios'
              ? 'bg-green-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          Guia de Exercícios ({currentPhase.exercises.length})
        </button>

        <button
          onClick={() => setActiveTab('sessao')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'sessao'
              ? 'bg-green-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          Sessão Interativa
        </button>

        <button
          onClick={() => setActiveTab('cronograma')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'cronograma'
              ? 'bg-green-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Divisão Semanal & Handebol
        </button>

        <button
          onClick={() => setActiveTab('criterios')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'criterios'
              ? 'bg-green-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Critérios de Avanço & LSI
        </button>

        <button
          onClick={() => setActiveTab('alertas')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'alertas'
              ? 'bg-green-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Sinais de Alerta
        </button>
      </div>

      {/* Seletor Rápido de Fase (1, 2 ou 3) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Progressão Metodológica</p>
            <h3 className="text-base font-black uppercase italic text-white">Selecione a Fase Atual:</h3>
          </div>
          <span className="text-xs font-black uppercase text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            {currentPhase.weeksRange}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PLYOMETRIC_PHASES.map((phase) => {
            const isSelected = selectedPhaseNum === phase.phaseNumber;
            return (
              <button
                key={phase.phaseNumber}
                onClick={() => {
                  setSelectedPhaseNum(phase.phaseNumber);
                  setActiveExerciseIdx(0);
                  setExpandedExerciseId(phase.exercises[0]?.id || null);
                }}
                className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                  isSelected
                    ? 'bg-zinc-950 border-green-500 ring-2 ring-green-500/30 shadow-lg shadow-green-500/10'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    Fase {phase.phaseNumber}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold">{phase.contactRangePerSession}</span>
                </div>
                <h4 className="font-black text-sm text-white uppercase italic leading-tight">{phase.name.split(':')[1]}</h4>
                <p className="text-[11px] text-zinc-400 font-medium line-clamp-2">{phase.primaryFocus}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ABA 1: VISÃO GERAL DAS 3 FASES */}
      {activeTab === 'fases' && (
        <div className="space-y-6">
          {/* Card Detalhado da Fase Selecionada */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-green-400 font-black">
                  Detalhamento Completo • Fase {currentPhase.phaseNumber} de 3
                </span>
                <h3 className="text-2xl font-black uppercase italic text-white">{currentPhase.name}</h3>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{currentPhase.subtitle}</p>
              </div>
              <div className="bg-zinc-950 px-4 py-2 rounded-2xl border border-zinc-800 text-center sm:text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Duração & Volume</span>
                <span className="text-xs font-black text-green-400 block">{currentPhase.weeksRange}</span>
                <span className="text-[11px] font-mono text-zinc-300">{currentPhase.contactRangePerSession}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Fundamentação Clínica & Fisiológica:</h4>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
                {currentPhase.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
                <div className="flex items-center gap-2 text-green-400 font-black uppercase text-xs">
                  <Flame className="w-4 h-4" />
                  <span>Meta Biomecânica</span>
                </div>
                <p className="text-xs text-zinc-300 font-medium leading-relaxed">{currentPhase.biomechanicalGoal}</p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2">
                <div className="flex items-center gap-2 text-green-400 font-black uppercase text-xs">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  <span>Critérios Obrigatórios para Avançar</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1.5 font-medium">
                  {currentPhase.criteriaToAdvance.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 font-bold shrink-0">•</span>
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lista Resumida dos Exercícios da Fase */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                  Exercícios Desta Fase ({currentPhase.exercises.length}):
                </h4>
                <button
                  onClick={() => setActiveTab('exercicios')}
                  className="text-xs font-black uppercase text-green-400 hover:text-green-300 flex items-center gap-1"
                >
                  Ver Execução Passo a Passo
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPhase.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    onClick={() => {
                      setExpandedExerciseId(ex.id);
                      setActiveTab('exercicios');
                    }}
                    className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="space-y-1 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="font-bold text-xs text-white uppercase truncate group-hover:text-green-400 transition-colors">
                          {ex.name}
                        </h5>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-400 pl-7">{ex.targetContacts}</p>
                    </div>

                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 shrink-0">
                      {ex.vector}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActiveTab('sessao')}
                className="bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all grow"
              >
                <Play className="w-4 h-4 fill-black" />
                Iniciar Sessão de Pliometria da Fase {currentPhase.phaseNumber}
              </button>

              <button
                onClick={() => setActiveTab('cronograma')}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 border border-zinc-700"
              >
                <Calendar className="w-4 h-4" />
                Ver Como Encaixar no Handebol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: GUIA DETALHADO DE EXERCÍCIOS */}
      {activeTab === 'exercicios' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Catálogo de Execução Técnica</p>
                <h3 className="text-xl font-black uppercase italic text-white">
                  Exercícios da Fase {currentPhase.phaseNumber} ({currentPhase.exercises.length})
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-green-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                {currentPhase.contactRangePerSession}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              Clique em qualquer exercício para abrir o passo a passo de execução, pistas biomecânicas anti-valgo, erros proibidos e relevância para o handebol.
            </p>
          </div>

          <div className="space-y-3">
            {currentPhase.exercises.map((ex, idx) => {
              const isExpanded = expandedExerciseId === ex.id;
              return (
                <div
                  key={ex.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center font-black text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black uppercase text-white">{ex.name}</h4>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-950 text-green-400 border border-green-500/30">
                            {ex.type}
                          </span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800">
                            Vetor {ex.vector}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                          {ex.targetContacts} • Descanso: {ex.restSeconds}s
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-zinc-500 hidden sm:inline font-bold">
                        {isExpanded ? 'Ocultar' : 'Ver Detalhes'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 pt-0 border-t border-zinc-800/80 space-y-4 bg-zinc-950/50 animate-in fade-in-50">
                      {/* Objetivo */}
                      <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Objetivo Principal:</span>
                        <p className="text-zinc-200 font-medium">{ex.objective}</p>
                      </div>

                      {/* Passo a Passo de Execução */}
                      <div className="space-y-2">
                        <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider block">
                          Passo a Passo de Execução:
                        </span>
                        <div className="space-y-2">
                          {ex.executionSteps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-3 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800/80 text-xs">
                              <span className="w-5 h-5 rounded-full bg-green-500 text-black font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span className="text-zinc-200 font-medium leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pistas Biomecânicas (Cues) & Erros Comuns */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-2xl space-y-2">
                          <span className="text-xs font-black uppercase text-green-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            Pistas Biomecânicas (O que Fazer):
                          </span>
                          <ul className="text-xs text-zinc-300 space-y-1.5 font-medium">
                            {ex.biomechanicalCues.map((cue, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-2">
                                <span className="text-green-400 font-bold shrink-0">✓</span>
                                <span>{cue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl space-y-2">
                          <span className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            Erros Proibidos (Risco ao LCA/Menisco):
                          </span>
                          <ul className="text-xs text-zinc-300 space-y-1.5 font-medium">
                            {ex.commonMistakes.map((err, eIdx) => (
                              <li key={eIdx} className="flex items-start gap-2">
                                <span className="text-red-400 font-bold shrink-0">✕</span>
                                <span>{err}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Relevância para o Handebol */}
                      <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 text-xs flex items-start gap-2.5">
                        <Flame className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white uppercase text-[11px] block">Aplicação Direta no Handebol:</span>
                          <p className="text-zinc-300 mt-0.5">{ex.handballRelevance}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: SESSÃO PRÁTICA INTERATIVA (TIMER & CONTADOR) */}
      {activeTab === 'sessao' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-green-400">
                  Execução em Tempo Real
                </span>
                <h3 className="text-2xl font-black uppercase italic text-white">
                  Treino de Pliometria — Fase {currentPhase.phaseNumber}
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  Marque cada série concluída para disparar automaticamente o timer de descanso.
                </p>
              </div>

              {/* Timer Widget */}
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4 shrink-0">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">Descanso</span>
                  <span className="text-2xl font-mono font-black text-green-400">
                    {restTimerSeconds !== null ? `${Math.floor(restTimerSeconds / 60)}:${(restTimerSeconds % 60).toString().padStart(2, '0')}` : '00:00'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isTimerRunning ? (
                    <button
                      onClick={() => setIsTimerRunning(false)}
                      className="bg-amber-500 hover:bg-amber-400 text-black p-2.5 rounded-xl transition-all"
                      title="Pausar Timer"
                    >
                      <Pause className="w-4 h-4 fill-black" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (restTimerSeconds && restTimerSeconds > 0) setIsTimerRunning(true);
                        else handleStartRestTimer(60);
                      }}
                      className="bg-green-500 hover:bg-green-400 text-black p-2.5 rounded-xl transition-all"
                      title="Iniciar Timer"
                    >
                      <Play className="w-4 h-4 fill-black" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setRestTimerSeconds(null);
                      setIsTimerRunning(false);
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2.5 rounded-xl transition-all"
                    title="Zerar Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Lista dos Exercícios com Botões de Séries Interativas */}
            <div className="space-y-4">
              {currentPhase.exercises.map((ex, exIdx) => {
                const completedSets = completedSetsMap[ex.id] || new Array(ex.sets).fill(false);
                const allCompleted = completedSets.every(Boolean);

                return (
                  <div
                    key={ex.id}
                    className={`bg-zinc-950 border rounded-2xl p-5 space-y-4 transition-all ${
                      allCompleted ? 'border-green-500/60 bg-green-500/5' : 'border-zinc-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black flex items-center justify-center">
                            {exIdx + 1}
                          </span>
                          <h4 className="font-black text-sm uppercase text-white">{ex.name}</h4>
                          {allCompleted && (
                            <span className="text-[10px] font-black text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
                              Concluído ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 font-mono pl-7">
                          {ex.sets} séries x {ex.reps} reps ({ex.targetContacts}) • Pausa recomendada: {ex.restSeconds}s
                        </p>
                      </div>

                      <span className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800 shrink-0">
                        {ex.biomechanicalCues[0]}
                      </span>
                    </div>

                    {/* Botões de Série */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      {Array.from({ length: ex.sets }).map((_, setIdx) => {
                        const isDone = completedSets[setIdx];
                        return (
                          <button
                            key={setIdx}
                            onClick={() => handleToggleSetComplete(ex.id, setIdx, ex.sets, ex.restSeconds)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                              isDone
                                ? 'bg-green-500 text-black shadow-md shadow-green-500/20'
                                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                            }`}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="w-3.5 h-3.5 rounded-full border border-zinc-500"></span>}
                            Série {setIdx + 1} ({ex.reps} reps)
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handleStartRestTimer(ex.restSeconds)}
                        className="text-xs font-bold uppercase text-zinc-400 hover:text-white bg-zinc-900 px-3 py-2.5 rounded-xl border border-zinc-800 flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Pausar {ex.restSeconds}s
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Card de Finalização */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-black text-sm uppercase text-white">Finalizou a Sessão de Pliometria?</h4>
                <p className="text-xs text-zinc-400 font-medium">
                  Excelente trabalho! Monitore seu joelho nas próximas 24h para garantir ausência de dor e inchaço.
                </p>
              </div>

              <button
                onClick={() => {
                  playCheckSound();
                  alert('Parabéns pela sessão de pliometria! Descanse pelo menos 48h antes da próxima sessão de saltos.');
                }}
                className="bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider text-xs px-6 py-3 rounded-xl shadow-lg shadow-green-500/20 shrink-0"
              >
                Concluir Sessão ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: CRONOGRAMA SEMANAL & INTEGRAÇÃO COM HANDEBOL */}
      {activeTab === 'cronograma' && (
        <div className="space-y-6">
          {/* Seletor de Divisão: 2x ou 3x por semana */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Planejador de Rotina</p>
                <h3 className="text-xl font-black uppercase italic text-white">
                  Integração: Pliometria + Musculação + Handebol
                </h3>
              </div>

              {/* Botões de Alternância 2 Dias vs 3 Dias */}
              <div className="bg-zinc-950 p-1 rounded-2xl border border-zinc-800 flex items-center gap-1">
                <button
                  onClick={() => setSelectedScheduleId('2_days')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    selectedScheduleId === '2_days'
                      ? 'bg-green-500 text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  2x / Semana (Recomendada)
                </button>
                <button
                  onClick={() => setSelectedScheduleId('3_days')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    selectedScheduleId === '3_days'
                      ? 'bg-green-500 text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  3x / Semana (Avançado)
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-medium leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80">
              <strong className="text-green-400">{currentSchedule.title}:</strong> {currentSchedule.subtitle}
              <br />
              <span className="text-zinc-400 mt-1 block">📌 {currentSchedule.recommendedFor}</span>
            </p>

            {/* Tabela de Dias da Semana */}
            <div className="space-y-2.5 pt-2">
              {currentSchedule.days.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-800">
                        {day.dayName}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          day.intensity === 'Alta'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : day.intensity === 'Moderada'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : day.intensity === 'Baixa'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {day.intensity}
                      </span>
                    </div>

                    <h4 className="text-sm font-black uppercase text-white">{day.activity}</h4>

                    {day.plyoSession && (
                      <p className="text-xs text-green-400 font-bold flex items-center gap-1 mt-0.5">
                        ⚡ {day.plyoSession}
                      </p>
                    )}
                    {day.gymNotes && (
                      <p className="text-[11px] text-zinc-400 font-medium">🏋️ {day.gymNotes}</p>
                    )}
                    {day.handballNotes && (
                      <p className="text-[11px] text-zinc-400 font-medium">🤾 {day.handballNotes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Regras de Ouro da Integração */}
            <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-2xl space-y-2.5">
              <span className="text-xs font-black uppercase text-green-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                Regras de Ouro para a Integração com o Handebol:
              </span>
              <ul className="text-xs text-zinc-300 space-y-2 font-medium">
                {currentSchedule.goldenRules.map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold shrink-0">✦</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: CRITÉRIOS DE AVANÇO & CALCULADORA LSI */}
      {activeTab === 'criterios' && (
        <div className="space-y-6">
          {/* Calculadora de LSI (Limb Symmetry Index) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20 shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic text-white">
                  Calculadora do Índice de Simetria de Membros (LSI)
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  Insira a distância atingida no teste de salto com 1 perna para calcular sua simetria percentual.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider block">
                  Perna Sã (Distância em cm):
                </label>
                <input
                  type="number"
                  value={healthyLegDistance}
                  onChange={(e) => setHealthyLegDistance(e.target.value)}
                  className="w-full bg-zinc-900 text-white font-mono font-black text-lg p-3 rounded-xl border border-zinc-700 outline-none focus:border-green-500"
                />
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider block">
                  Perna Operada (Distância em cm):
                </label>
                <input
                  type="number"
                  value={operatedLegDistance}
                  onChange={(e) => setOperatedLegDistance(e.target.value)}
                  className="w-full bg-zinc-900 text-white font-mono font-black text-lg p-3 rounded-xl border border-zinc-700 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Resultado do LSI */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">Índice LSI Calculado</span>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black italic font-mono text-green-400">{calculatedLSI}%</span>
                  <span
                    className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                      lsiNum >= 90
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : lsiNum >= 85
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {lsiNum >= 90
                      ? 'Pronto para Fase 3 / Alta Específica'
                      : lsiNum >= 85
                      ? 'Apto para Fase 2'
                      : 'Manter Fase 1 (Meta: ≥85%)'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 max-w-xs font-medium">
                Padrão científico: ≥85% para saltos lineares com 1 perna; ≥90% para cortes e handebol com contato.
              </p>
            </div>
          </div>

          {/* Checklist de Critérios de Avanço */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Checklist de Segurança</p>
                <h3 className="text-xl font-black uppercase italic text-white">
                  Critérios para Avançar de Fase
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">
                {Object.values(checkedCriteria).filter(Boolean).length} / {ADVANCEMENT_CRITERIA.length} Aprovados
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {ADVANCEMENT_CRITERIA.map((crit) => {
                const isChecked = !!checkedCriteria[crit.id];
                return (
                  <div
                    key={crit.id}
                    onClick={() => handleToggleCriterion(crit.id)}
                    className={`bg-zinc-950 border rounded-2xl p-4 flex items-start justify-between gap-4 cursor-pointer transition-all ${
                      isChecked ? 'border-green-500/60 bg-green-500/5' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {crit.category}
                        </span>
                        <h4 className="text-sm font-black uppercase text-white">{crit.title}</h4>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">{crit.description}</p>
                      <p className="text-[11px] text-green-400 font-mono font-bold">Meta: {crit.threshold}</p>
                    </div>

                    <button
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                        isChecked ? 'bg-green-500 text-black border-green-500' : 'border-zinc-700 bg-zinc-900'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA 6: SINAIS DE ALERTA (RED FLAGS) */}
      {activeTab === 'alertas' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic text-white">
                  Sinais de Alerta & Quando Regredir a Carga
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  Aos 6 meses, o enxerto do LCA ainda está no processo de maturação biológica. Use este guia para distinguir adaptação normal de sobrecarga articular.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {RED_FLAGS.map((rf) => (
                <div
                  key={rf.id}
                  className={`p-5 rounded-2xl border space-y-2.5 ${
                    rf.severity === 'grave'
                      ? 'bg-red-500/5 border-red-500/30'
                      : rf.severity === 'moderado'
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-green-500/5 border-green-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-black uppercase ${
                        rf.severity === 'grave'
                          ? 'text-red-400'
                          : rf.severity === 'moderado'
                          ? 'text-amber-400'
                          : 'text-green-400'
                      }`}
                    >
                      {rf.title}
                    </h4>
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        rf.severity === 'grave'
                          ? 'bg-red-500/20 text-red-300'
                          : rf.severity === 'moderado'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}
                    >
                      {rf.severity === 'grave' ? 'Interromper Treino' : rf.severity === 'moderado' ? 'Ajustar Série' : 'Adaptação Normal'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-zinc-200">
                      <strong className="text-zinc-400">Sintoma:</strong> {rf.symptom}
                    </p>
                    <p className="text-zinc-300">
                      <strong className="text-zinc-400">O que significa:</strong> {rf.whatItMeans}
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300 font-medium">
                    <strong className="text-white">Ação Recomendada:</strong> {rf.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

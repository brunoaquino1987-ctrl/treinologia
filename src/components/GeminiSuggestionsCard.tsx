import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutLog, Workout } from '../types';
import {
  GeminiOverloadResponse,
  GeminiOverloadSuggestion,
  fetchProgressiveOverloadSuggestions,
  getCachedAiSuggestions,
  getAppliedSuggestionIds,
  toggleAppliedSuggestionId,
} from '../services/aiService';
import {
  Sparkles,
  TrendingUp,
  Repeat,
  ShieldCheck,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  Dumbbell,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Flame,
  Check,
} from 'lucide-react';

interface GeminiSuggestionsCardProps {
  user: UserProfile;
  logs: WorkoutLog[];
  workouts: Workout[];
  suggestedWorkoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b';
  onStartWorkout: (workoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b') => void;
}

export const GeminiSuggestionsCard: React.FC<GeminiSuggestionsCardProps> = ({
  user,
  logs,
  workouts,
  suggestedWorkoutId,
  onStartWorkout,
}) => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(suggestedWorkoutId);
  const [data, setData] = useState<GeminiOverloadResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load cached suggestions on mount, or fetch if none
  useEffect(() => {
    setAppliedIds(getAppliedSuggestionIds());
    const cached = getCachedAiSuggestions();
    if (cached) {
      setData(cached);
      if (cached.targetWorkout?.id) {
        setSelectedWorkoutId(cached.targetWorkout.id);
      }
    } else {
      handleFetchSuggestions(suggestedWorkoutId);
    }
  }, [suggestedWorkoutId]);

  const handleFetchSuggestions = async (targetId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProgressiveOverloadSuggestions(user, logs, workouts, targetId);
      setData(result);
      setSelectedWorkoutId(targetId);
    } catch (err: any) {
      console.error('Erro ao buscar sugestões:', err);
      setError(err?.message || 'Não foi possível carregar as sugestões de IA no momento.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApplied = (exerciseId: string) => {
    const updated = toggleAppliedSuggestionId(exerciseId);
    setAppliedIds(updated);
  };

  const currentWorkoutObj = workouts.find((w) => w.id === selectedWorkoutId) || workouts[0];

  const suggestions = data?.suggestions || [];
  const filteredSuggestions = suggestions.filter((item) => {
    if (filterAction === 'all') return true;
    if (filterAction === 'weight') return item.actionType === 'increase_weight';
    if (filterAction === 'reps') return item.actionType === 'increase_reps';
    if (filterAction === 'knee') return !!item.kneeCaution;
    return true;
  });

  const getActionBadge = (actionType: GeminiOverloadSuggestion['actionType']) => {
    switch (actionType) {
      case 'increase_weight':
        return {
          label: '+ Carga Progressiva',
          icon: TrendingUp,
          bg: 'bg-green-500/15 text-green-400 border-green-500/30',
        };
      case 'increase_reps':
        return {
          label: '+ Repetições (Dupla Prog.)',
          icon: Repeat,
          bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        };
      case 'maintain_form':
        return {
          label: 'Consolidação Técnica',
          icon: ShieldCheck,
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        };
      case 'deload_recovery':
        return {
          label: 'Regeneração Deload',
          icon: Zap,
          bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        };
      default:
        return {
          label: 'Ajuste Geral',
          icon: Activity,
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        };
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header com Branding Gemini AI */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-green-500/20 text-green-400 border border-green-500/40 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-green-400" />
              Treinologia AI • Powered by Gemini
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700">
              Semana {user.currentWeek} • Sobrecarga Inteligente
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white flex items-center gap-2.5">
            Sugestões & Metas da Próxima Sessão
          </h3>

          <p className="text-xs text-zinc-400 font-medium max-w-2xl leading-relaxed">
            O Gemini analisa o histórico dos seus últimos treinos, faixas de RPE, execução e proteção articular para calcular o ajuste ideal de carga e repetições no modelo de <strong className="text-zinc-200">Dupla Progressão</strong>.
          </p>
        </div>

        {/* Botão de Atualizar Análise */}
        <button
          onClick={() => handleFetchSuggestions(selectedWorkoutId)}
          disabled={loading}
          className="bg-zinc-800 hover:bg-zinc-750 active:scale-95 text-zinc-200 hover:text-white border border-zinc-700 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all disabled:opacity-50 shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-green-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analisando Logs...' : 'Recalcular Metas'}</span>
        </button>
      </div>

      {/* Seletor de Treino Alvo (Abas) */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Selecione o treino para calibrar:</p>
        <div className="flex flex-wrap gap-2">
          {workouts.map((w) => {
            const isSelected = w.id === selectedWorkoutId;
            const isToday = w.id === suggestedWorkoutId;

            return (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedWorkoutId(w.id);
                  handleFetchSuggestions(w.id);
                }}
                disabled={loading}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/20 font-black'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/80 font-bold'
                }`}
              >
                <span>{w.name.split(' ')[0]}</span>
                {isToday && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase tracking-tighter ${
                      isSelected ? 'bg-black text-green-400' : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    Hoje
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
              <div className="h-3 bg-zinc-800/60 rounded w-2/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="h-24 bg-zinc-800/40 rounded-xl"></div>
            <div className="h-24 bg-zinc-800/40 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Erro Notice */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Aviso na Análise da IA</p>
            <p className="text-red-300/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Resumo do Treinador Gemini & Card de Prontidão */}
      {data && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Resumo do Coach */}
          <div className="lg:col-span-2 bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase italic tracking-wider text-zinc-200">
                  Parecer do Treinador AI
                </span>
              </div>

              {data.aiPowered && (
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                  Gemini 3.6 Flash
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {data.coachSummary}
            </p>

            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Estratégia:</span>
              <span className="text-green-400 font-bold italic truncate max-w-[280px] sm:max-w-md">
                {data.overallStrategy}
              </span>
            </div>
          </div>

          {/* KPI de Prontidão & Ação Rápida */}
          <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                Índice de Prontidão
              </span>
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {data.readinessScore >= 85 ? 'Ótima' : 'Boa'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black italic text-white">{data.readinessScore}</span>
              <span className="text-xs text-zinc-500 font-mono font-bold">/ 100</span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden ml-2">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${data.readinessScore}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onStartWorkout(currentWorkoutObj.id)}
              className="w-full bg-green-500 hover:bg-green-400 text-black py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Iniciar {currentWorkoutObj.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filtros de Sugestões */}
      {data && !loading && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-green-400" />
              <h4 className="text-sm font-black uppercase italic tracking-wider text-white">
                Ajustes Recomendados ({filteredSuggestions.length})
              </h4>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setFilterAction('all')}
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition-all ${
                  filterAction === 'all'
                    ? 'bg-zinc-200 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterAction('weight')}
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition-all ${
                  filterAction === 'weight'
                    ? 'bg-green-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-green-400'
                }`}
              >
                + Carga
              </button>
              <button
                onClick={() => setFilterAction('reps')}
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition-all ${
                  filterAction === 'reps'
                    ? 'bg-cyan-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-cyan-400'
                }`}
              >
                + Reps
              </button>
              <button
                onClick={() => setFilterAction('knee')}
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition-all ${
                  filterAction === 'knee'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-amber-400'
                }`}
              >
                🛡️ Joelho LCA
              </button>
            </div>
          </div>

          {/* Grid de Recomendações de Exercícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSuggestions.map((item) => {
              const badge = getActionBadge(item.actionType);
              const isApplied = appliedIds.includes(item.exerciseId);
              const isExpanded = expandedId === item.exerciseId;
              const ActionIcon = badge.icon;

              return (
                <div
                  key={item.exerciseId}
                  className={`bg-zinc-950/80 border rounded-2xl p-4.5 space-y-3 transition-all ${
                    isApplied
                      ? 'border-green-500/50 bg-green-950/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Topo do Card de Exercício */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}>
                          <ActionIcon className="w-3 h-3" />
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {item.muscleGroup}
                        </span>
                      </div>

                      <h5 className="text-base font-black uppercase italic tracking-tight text-white">
                        {item.exerciseName}
                      </h5>
                    </div>

                    {/* Botão de Marcar / Aplicar */}
                    <button
                      onClick={() => handleToggleApplied(item.exerciseId)}
                      title={isApplied ? 'Desmarcar sugestão' : 'Marcar como revisada para o treino'}
                      className={`p-2 rounded-xl transition-all shrink-0 ${
                        isApplied
                          ? 'bg-green-500 text-black shadow-md shadow-green-500/20'
                          : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700'
                      }`}
                    >
                      {isApplied ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Comparativo: Último Treino vs Meta Sugerida */}
                  <div className="grid grid-cols-2 gap-2 bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800/80">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider">Última Sessão</span>
                      <p className="text-xs font-mono font-bold text-zinc-300 truncate">
                        {item.lastPerformance}
                      </p>
                    </div>

                    <div className="space-y-0.5 border-l border-zinc-800 pl-2">
                      <span className="text-[9px] font-black uppercase text-green-400 tracking-wider flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Meta Calibrada
                      </span>
                      <p className="text-xs font-mono font-black text-green-300">
                        {item.nextTarget}
                      </p>
                    </div>
                  </div>

                  {/* Rationale do Gemini */}
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    {item.rationale}
                  </p>

                  {/* Alerta de Joelho / Biomecânica se houver */}
                  {item.kneeCaution && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-amber-300/90 font-medium flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item.kneeCaution}</span>
                    </div>
                  )}

                  {/* Toggle para ver dica biomecânica avançada */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.exerciseId)}
                    className="w-full text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1 pt-1 border-t border-zinc-900"
                  >
                    <span>{isExpanded ? 'Ocultar Detalhes Biomecânicos' : 'Ver Dica de Execução & Cadência'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="bg-zinc-900/90 rounded-xl p-3 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                      <p className="text-[10px] font-black uppercase text-green-400">💡 Instrução Biomecânica:</p>
                      <p className="text-zinc-300">{item.biomechanicalTip}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pontos de Foco Semanal */}
      {data?.weeklyFocus && data.weeklyFocus.length > 0 && !loading && (
        <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-green-400 fill-green-400" />
            <h5 className="text-xs font-black uppercase tracking-wider text-zinc-200">
              Diretrizes de Foco para a Semana {user.currentWeek}
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-zinc-300">
            {data.weeklyFocus.map((focusText, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex items-start gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="font-medium text-zinc-300 leading-snug">{focusText}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

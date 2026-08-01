import React, { useState, useEffect } from 'react';
import {
  Workout,
  Exercise,
  WorkoutLog,
  ExerciseLog,
  SetLog,
  UserProfile,
} from '../types';
import {
  getExerciseProgressions,
  getRecommendedWeightAndSets,
  saveWorkoutLog,
} from '../services/storageService';
import { CYCLE_WEEKS_CONFIG } from '../data/initialData';
import {
  getAlternativesForMuscle,
  AlternativeExercise,
} from '../data/exerciseAlternatives';
import { playCheckSound, playTimerAlertSound } from '../utils/audio';
import {
  getMuscleGroupsFromLog,
  getExerciseLogSummary,
  formatWorkoutShareText,
} from '../utils/workoutHelpers';
import confetti from 'canvas-confetti';
import {
  Check,
  Plus,
  Minus,
  Timer,
  Pause,
  Play,
  Repeat,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  Share2,
  Dumbbell,
  Search,
  Copy,
  Flame,
} from 'lucide-react';

interface WorkoutExecutionViewProps {
  workout: Workout;
  user: UserProfile;
  onFinishWorkout: (log: WorkoutLog) => void;
  onCancelWorkout: () => void;
  onOpenShareModal?: (log: WorkoutLog) => void;
}

export const WorkoutExecutionView: React.FC<WorkoutExecutionViewProps> = ({
  workout,
  user,
  onFinishWorkout,
  onCancelWorkout,
  onOpenShareModal,
}) => {
  const progressions = getExerciseProgressions();

  // Estado dos exercícios ativos (permite trocar qualquer exercício por alternativas do mesmo músculo)
  const [activeExercises, setActiveExercises] = useState<Exercise[]>(workout.exercises);

  // Estado das séries de cada exercício
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, { sets: SetLog[]; rpe: number; notes: string }>>({});

  // Cronômetro do treino inteiro
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Cronômetro de descanso (Rest Timer)
  const [restTimer, setRestTimer] = useState<{
    active: boolean;
    secondsLeft: number;
    totalSeconds: number;
    exerciseName: string;
  }>({
    active: false,
    secondsLeft: 0,
    totalSeconds: 0,
    exerciseName: '',
  });

  const [restPaused, setRestPaused] = useState(false);

  // Modal de substituição de exercício por grupo muscular
  const [swapModalState, setSwapModalState] = useState<{
    open: boolean;
    exercise: Exercise | null;
    searchFilter: string;
  }>({ open: false, exercise: null, searchFilter: '' });

  // Modal de finalização e resumo do treino
  const [completedLogModal, setCompletedLogModal] = useState<WorkoutLog | null>(null);

  // Inicializar logs das séries ao carregar
  useEffect(() => {
    const initialLogs: Record<string, { sets: SetLog[]; rpe: number; notes: string }> = {};

    workout.exercises.forEach((ex) => {
      const prog = progressions[ex.id];
      const rec = getRecommendedWeightAndSets(ex, user.currentWeek, prog);

      const sets: SetLog[] = [];
      for (let i = 1; i <= rec.targetSets; i++) {
        sets.push({
          setNumber: i,
          targetWeight: rec.targetWeight,
          targetReps: rec.targetReps,
          weight: rec.targetWeight,
          reps: rec.targetReps,
          completed: false,
        });
      }

      initialLogs[ex.id] = {
        sets,
        rpe: 8,
        notes: '',
      };
    });

    setExerciseLogs(initialLogs);
  }, [workout, user.currentWeek]);

  // Timer do tempo decorrido do treino
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer de descanso de séries
  useEffect(() => {
    if (!restTimer.active || restPaused) return;

    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (prev.secondsLeft <= 1) {
          playTimerAlertSound();
          return { ...prev, active: false, secondsLeft: 0 };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer.active, restPaused]);

  // Alternar conclusão da série
  const toggleSetCompleted = (exerciseId: string, setIndex: number) => {
    const currentEx = exerciseLogs[exerciseId];
    if (!currentEx) return;

    const newSets = [...currentEx.sets];
    const targetSet = newSets[setIndex];
    const newCompletedState = !targetSet.completed;

    targetSet.completed = newCompletedState;

    setExerciseLogs((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: newSets,
      },
    }));

    if (newCompletedState) {
      playCheckSound();

      // Iniciar timer de descanso
      const exObj = activeExercises.find((e) => e.id === exerciseId);
      if (exObj) {
        setRestTimer({
          active: true,
          secondsLeft: exObj.restSeconds,
          totalSeconds: exObj.restSeconds,
          exerciseName: exObj.name,
        });
        setRestPaused(false);
      }
    }
  };

  // Ajustar peso ou reps incrementalmente (+ / -)
  const updateSetDetailDelta = (
    exerciseId: string,
    setIndex: number,
    field: 'weight' | 'reps',
    delta: number
  ) => {
    const currentEx = exerciseLogs[exerciseId];
    if (!currentEx) return;

    const newSets = [...currentEx.sets];
    const targetSet = newSets[setIndex];

    if (field === 'weight') {
      targetSet.weight = Math.max(0, Math.round((targetSet.weight + delta) * 2) / 2);
    } else {
      targetSet.reps = Math.max(0, targetSet.reps + delta);
    }

    setExerciseLogs((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: newSets,
      },
    }));
  };

  // Edição DIRETA do peso ou reps digitando no input
  const updateSetDetailExact = (
    exerciseId: string,
    setIndex: number,
    field: 'weight' | 'reps',
    value: number
  ) => {
    const currentEx = exerciseLogs[exerciseId];
    if (!currentEx) return;

    const newSets = [...currentEx.sets];
    const targetSet = newSets[setIndex];

    if (field === 'weight') {
      targetSet.weight = Math.max(0, value);
    } else {
      targetSet.reps = Math.max(0, Math.round(value));
    }

    setExerciseLogs((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: newSets,
      },
    }));
  };

  // Substituir QUALQUER exercício ativo por alternativa sugerida do mesmo músculo
  const handleSwapExerciseTo = (originalId: string, alternative: AlternativeExercise) => {
    const prevLogsForEx = exerciseLogs[originalId];

    setActiveExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === originalId) {
          return {
            ...ex,
            id: alternative.id,
            name: alternative.name,
            type: alternative.type,
            muscleGroup: alternative.muscleGroup,
            instructions: alternative.instructions || alternative.description,
          };
        }
        return ex;
      })
    );

    // Transferir os dados e séries já preenchidos para a chave do novo exercício
    if (prevLogsForEx) {
      setExerciseLogs((prev) => {
        const next = { ...prev };
        delete next[originalId];
        next[alternative.id] = prevLogsForEx;
        return next;
      });
    }

    setSwapModalState({ open: false, exercise: null, searchFilter: '' });
  };

  // Concluir treino e calcular volume total
  const handleCompleteWorkout = () => {
    let totalVolume = 0;
    const finalExercisesLogs: ExerciseLog[] = [];

    activeExercises.forEach((ex) => {
      const exState = exerciseLogs[ex.id];
      if (!exState) return;

      const completedSets = exState.sets.filter((s) => s.completed);
      completedSets.forEach((s) => {
        totalVolume += s.weight * s.reps;
      });

      finalExercisesLogs.push({
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: exState.sets,
        rpe: exState.rpe,
        notes: exState.notes,
      });
    });

    const now = new Date();
    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));

    const workoutLog: WorkoutLog = {
      id: `log_${Date.now()}`,
      userId: user.uid,
      workoutId: workout.id,
      workoutName: workout.name,
      date: now.toISOString().split('T')[0],
      startTime: new Date(now.getTime() - elapsedSeconds * 1000).toISOString(),
      endTime: now.toISOString(),
      durationMinutes: durationMins,
      exercises: finalExercisesLogs,
      totalVolumeKg: Math.round(totalVolume),
      notes: 'Treino concluído com sobrecarga progressiva e execução controlada.',
    };

    saveWorkoutLog(workoutLog);

    // Efeito de confetes
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    setCompletedLogModal(workoutLog);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Top Bar de Execução */}
      <div className="bg-zinc-900/95 border border-zinc-800 rounded-3xl p-4 sm:p-5 sticky top-16 z-20 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping"></span>
              <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-white">{workout.name}</h2>
            </div>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{workout.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Cronômetro Principal */}
            <div className="bg-zinc-950 px-4 py-2 rounded-2xl border border-zinc-800 flex items-center gap-2 font-mono text-green-400 font-black text-base tracking-wider">
              <Clock className="w-4 h-4 text-green-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            <button
              onClick={handleCompleteWorkout}
              className="bg-green-500 hover:bg-green-400 active:scale-95 text-black font-black uppercase tracking-wider px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-green-500/20"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>Finalizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Exercícios */}
      <div className="space-y-6">
        {activeExercises.map((ex, exIdx) => {
          const exState = exerciseLogs[ex.id] || { sets: [], rpe: 8, notes: '' };

          return (
            <div
              key={ex.id}
              className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 sm:p-6 space-y-4 shadow-xl"
            >
              {/* Header do Exercício */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black font-mono text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                      #{exIdx + 1}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20">
                      {ex.muscleGroup}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded-full">
                      {ex.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-black uppercase italic text-white">{ex.name}</h3>

                  {ex.instructions && (
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-2xl">
                      {ex.instructions}
                    </p>
                  )}
                </div>

                {/* Botão para Trocar QUALQUER exercício por sugestão do mesmo músculo */}
                <button
                  onClick={() => setSwapModalState({ open: true, exercise: ex, searchFilter: '' })}
                  className="self-start sm:self-center bg-zinc-800 hover:bg-zinc-700 text-green-400 hover:text-green-300 border border-zinc-700 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Trocar Exercício</span>
                </button>
              </div>

              {/* Tabela de Séries com edição direta no quadro de números */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 text-[10px] font-black text-zinc-500 px-2 uppercase tracking-widest">
                  <span className="col-span-2">Série</span>
                  <span className="col-span-4 text-center">Carga (kg)</span>
                  <span className="col-span-4 text-center">Reps</span>
                  <span className="col-span-2 text-right">Feito</span>
                </div>

                {exState.sets.map((set, sIdx) => (
                  <div
                    key={sIdx}
                    className={`grid grid-cols-12 items-center p-3 rounded-2xl border transition-all ${
                      set.completed
                        ? 'bg-green-950/20 border-green-500/50'
                        : 'bg-zinc-950 border-zinc-800'
                    }`}
                  >
                    {/* Número da Série */}
                    <div className="col-span-2 flex items-center gap-1 font-mono font-black text-sm text-zinc-300">
                      <span>S{set.setNumber}</span>
                    </div>

                    {/* Edição Direta de Carga (Digitando ou Botões +/-) */}
                    <div className="col-span-4 flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateSetDetailDelta(ex.id, sIdx, 'weight', -1)}
                        className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-zinc-200 font-black text-sm flex items-center justify-center shrink-0 border border-zinc-700"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={set.weight}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          updateSetDetailExact(ex.id, sIdx, 'weight', isNaN(val) ? 0 : val);
                        }}
                        className="w-16 h-10 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono font-black text-base text-white text-center outline-none transition-all"
                      />

                      <button
                        type="button"
                        onClick={() => updateSetDetailDelta(ex.id, sIdx, 'weight', 1)}
                        className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-zinc-200 font-black text-sm flex items-center justify-center shrink-0 border border-zinc-700"
                      >
                        +
                      </button>
                    </div>

                    {/* Edição Direta de Repetições (Digitando ou Botões +/-) */}
                    <div className="col-span-4 flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateSetDetailDelta(ex.id, sIdx, 'reps', -1)}
                        className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-zinc-200 font-black text-sm flex items-center justify-center shrink-0 border border-zinc-700"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={set.reps}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          updateSetDetailExact(ex.id, sIdx, 'reps', isNaN(val) ? 0 : val);
                        }}
                        className="w-14 h-10 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono font-black text-base text-white text-center outline-none transition-all"
                      />

                      <button
                        type="button"
                        onClick={() => updateSetDetailDelta(ex.id, sIdx, 'reps', 1)}
                        className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-zinc-200 font-black text-sm flex items-center justify-center shrink-0 border border-zinc-700"
                      >
                        +
                      </button>
                    </div>

                    {/* Checkbox XL para Academia */}
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => toggleSetCompleted(ex.id, sIdx)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                          set.completed
                            ? 'bg-green-500 text-black scale-105 shadow-lg shadow-green-500/30'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500 border border-zinc-700'
                        }`}
                      >
                        <Check className={`w-6 h-6 ${set.completed ? 'stroke-[3.5]' : 'stroke-[2]'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* RPE & Notas do Exercício */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Esforço RPE:</span>
                  <select
                    value={exState.rpe}
                    onChange={(e) =>
                      setExerciseLogs((prev) => ({
                        ...prev,
                        [ex.id]: { ...prev[ex.id], rpe: Number(e.target.value) },
                      }))
                    }
                    className="bg-zinc-900 text-green-400 font-black text-xs rounded-xl px-2.5 py-1.5 border border-zinc-700 outline-none"
                  >
                    {[6, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((val) => (
                      <option key={val} value={val}>
                        RPE {val} {val === 8 ? '(Ideal)' : val === 10 ? '(Falha)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Anotação (ex: Carga boa, ótima postura)"
                  value={exState.notes}
                  onChange={(e) =>
                    setExerciseLogs((prev) => ({
                      ...prev,
                      [ex.id]: { ...prev[ex.id], notes: e.target.value },
                    }))
                  }
                  className="bg-zinc-950 text-zinc-200 placeholder-zinc-600 text-xs font-medium rounded-2xl px-4 py-3 border border-zinc-800 outline-none focus:border-green-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Rest Timer Modal Overlay */}
      {restTimer.active && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-zinc-900 border-2 border-green-500 rounded-3xl p-5 shadow-2xl shadow-green-500/20 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-green-400 animate-spin" />
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300">Descanso entre séries</span>
            </div>
            <button
              onClick={() => setRestTimer((prev) => ({ ...prev, active: false }))}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-4xl font-black font-mono text-green-400">
                {formatTime(restTimer.secondsLeft)}
              </p>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider truncate max-w-[180px]">
                {restTimer.exerciseName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestPaused(!restPaused)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-3 rounded-2xl text-xs font-black uppercase"
              >
                {restPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                onClick={() =>
                  setRestTimer((prev) => ({
                    ...prev,
                    secondsLeft: prev.secondsLeft + 30,
                  }))
                }
                className="bg-zinc-800 hover:bg-zinc-700 text-green-400 px-3.5 py-3 rounded-2xl text-xs font-black uppercase"
              >
                +30s
              </button>

              <button
                onClick={() => setRestTimer((prev) => ({ ...prev, active: false }))}
                className="bg-green-500 hover:bg-green-400 text-black px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider"
              >
                Pular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Substituição de Exercício (Mesmo Músculo) */}
      {swapModalState.open && swapModalState.exercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 shrink-0">
              <div className="flex items-center gap-2 text-green-400">
                <Repeat className="w-5 h-5" />
                <div>
                  <h3 className="font-black uppercase tracking-tight text-white text-base">
                    Substitutos para {swapModalState.exercise.muscleGroup}
                  </h3>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">
                    Exercício atual: {swapModalState.exercise.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSwapModalState({ open: false, exercise: null, searchFilter: '' })}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campo de Busca Rápida */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar substitutos..."
                value={swapModalState.searchFilter}
                onChange={(e) =>
                  setSwapModalState((prev) => ({ ...prev, searchFilter: e.target.value }))
                }
                className="w-full bg-zinc-950 text-white text-xs font-bold rounded-2xl pl-10 pr-4 py-2.5 border border-zinc-800 focus:border-green-500 outline-none"
              />
            </div>

            {/* Lista de Alternativas do Mesmo Músculo */}
            <div className="overflow-y-auto space-y-3 pr-1 grow">
              {(() => {
                const alternatives = getAlternativesForMuscle(
                  swapModalState.exercise.muscleGroup,
                  swapModalState.exercise.id
                ).filter(
                  (alt) =>
                    alt.name.toLowerCase().includes(swapModalState.searchFilter.toLowerCase()) ||
                    alt.description.toLowerCase().includes(swapModalState.searchFilter.toLowerCase())
                );

                if (alternatives.length === 0) {
                  return (
                    <p className="text-xs text-zinc-400 italic font-medium py-4 text-center">
                      Nenhum outro exercício encontrado para esta busca.
                    </p>
                  );
                }

                return alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => handleSwapExerciseTo(swapModalState.exercise!.id, alt)}
                    className="bg-zinc-950 border border-zinc-800 hover:border-green-500 p-4 rounded-2xl cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black uppercase text-white group-hover:text-green-400">
                        {alt.name}
                      </h4>
                      <span className="text-[9px] font-black uppercase bg-green-500/20 text-green-300 px-2.5 py-0.5 rounded-full border border-green-500/30 shrink-0">
                        {alt.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">{alt.description}</p>
                  </div>
                ));
              })()}
            </div>

            <div className="pt-2 flex justify-end shrink-0 border-t border-zinc-800">
              <button
                onClick={() => setSwapModalState({ open: false, exercise: null, searchFilter: '' })}
                className="bg-zinc-800 text-zinc-300 hover:text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Conclusão do Treino */}
      {completedLogModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-green-500/60 rounded-3xl max-w-lg w-full p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 my-auto max-h-[90vh] flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center mx-auto border border-green-500/40 shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1 shrink-0">
              <h3 className="text-2xl sm:text-3xl font-black uppercase italic text-white">Treino Concluído! 🎉</h3>
              <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                Seu registro de treino foi salvo com sucesso na sua conta!
              </p>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 grow">
              {/* Grupos Musculares Malhados */}
              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 text-left space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-green-400" />
                  Grupos Musculares Malhados:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {getMuscleGroupsFromLog(completedLogModal).map((group) => (
                    <span
                      key={group}
                      className="text-xs font-black uppercase bg-green-500 text-black px-3 py-0.5 rounded-xl shadow-sm"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resumo das Métricas */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">Volume Total</span>
                  <span className="text-xl font-black italic text-green-400">{completedLogModal.totalVolumeKg.toLocaleString('pt-BR')} kg</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">Duração</span>
                  <span className="text-xl font-black italic text-white">{completedLogModal.durationMinutes} min</span>
                </div>
              </div>

              {/* Lista dos Exercícios Concluídos */}
              <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 text-left space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block">
                  Exercícios Realizados ({(completedLogModal.exercises || []).length}):
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {(completedLogModal.exercises || []).map((ex, idx) => {
                    const { setsCompleted, maxWeight, repsAtMax } = getExerciseLogSummary(ex);
                    return (
                      <div key={idx} className="bg-zinc-900 px-3 py-2 rounded-xl flex items-center justify-between text-xs border border-zinc-800/80">
                        <span className="font-bold text-white truncate pr-2">{ex.exerciseName}</span>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                          <span className="text-zinc-400 font-bold">{setsCompleted} series</span>
                          {maxWeight > 0 && (
                            <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded font-black border border-green-500/30">
                              {maxWeight}kg x {repsAtMax}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-2.5 shrink-0 pt-1 border-t border-zinc-800">
              {onOpenShareModal && (
                <button
                  onClick={() => {
                    const log = completedLogModal;
                    setCompletedLogModal(null);
                    onOpenShareModal(log);
                  }}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <Share2 className="w-4 h-4" />
                  Gerar Card para Redes Sociais
                </button>
              )}

              <button
                onClick={() => {
                  const log = completedLogModal;
                  setCompletedLogModal(null);
                  onFinishWorkout(log);
                }}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-wider py-3 rounded-2xl text-xs"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

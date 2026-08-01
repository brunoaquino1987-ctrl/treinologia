import {
  UserProfile,
  WorkoutLog,
  ExerciseProgression,
  Workout,
} from '../types';
import { INITIAL_USER, WORKOUTS_PROGRAM } from '../data/initialData';
import { generateSampleLogs, generateInitialProgressions } from '../data/sampleLogs';
import {
  saveWorkoutLog,
  getWorkoutLogs,
  getExerciseProgressions,
  getUserProfile,
  saveUserProfile,
  resetToDefaultData,
} from './storageService';

const STORAGE_KEYS = {
  USER: 'treino_lca_user_v1',
  LOGS: 'treino_lca_logs_v1',
  PROGRESSIONS: 'treino_lca_progressions_v1',
  WORKOUTS: 'treino_lca_workouts_v1',
};

/**
 * Salva uma nova sessão de treino concluída no localStorage.
 * Atualiza o histórico de logs e calcula automaticamente as próximas progressões de carga.
 */
export function salvarTreino(treinoLog: WorkoutLog): WorkoutLog[] {
  return saveWorkoutLog(treinoLog);
}

/**
 * Recupera o histórico completo de treinos salvos no localStorage.
 * Retorna os dados mock de demonstração caso esteja vazio.
 */
export function buscarHistorico(): WorkoutLog[] {
  return getWorkoutLogs();
}

/**
 * Busca a progressão atual de carga e repetições de um determinado exercício pelo ID.
 */
export function buscarProgressoExercicio(exerciseId: string): ExerciseProgression | null {
  const todasProgressoes = getExerciseProgressions();
  if (todasProgressoes && todasProgressoes[exerciseId]) {
    return todasProgressoes[exerciseId];
  }

  // Tenta encontrar nos últimos treinos do histórico se não estiver na hash
  const historico = getWorkoutLogs();
  for (const log of historico) {
    const exLog = log.exercises.find((e) => e.exerciseId === exerciseId);
    if (exLog) {
      const completedSets = exLog.sets.filter((s) => s.completed && s.reps > 0);
      if (completedSets.length > 0) {
        let maxWeight = 0;
        let repsAtMax = 0;
        completedSets.forEach((s) => {
          if (s.weight >= maxWeight) {
            maxWeight = s.weight;
            repsAtMax = s.reps;
          }
        });

        return {
          userId: log.userId || 'user',
          exerciseId,
          lastWeight: maxWeight,
          lastReps: repsAtMax,
          nextTargetWeight: maxWeight + 2.5,
          nextTargetReps: 8,
          updatedAt: log.date,
        };
      }
    }
  }

  return null;
}

/**
 * Salva/Atualiza o perfil do usuário no localStorage.
 */
export function salvarPerfil(profile: UserProfile): UserProfile {
  return saveUserProfile(profile);
}

/**
 * Busca o perfil do usuário no localStorage.
 */
export function buscarPerfil(): UserProfile {
  return getUserProfile();
}

/**
 * Reseta todos os dados para os valores padrão e dados de exemplo.
 */
export function resetarDados() {
  return resetToDefaultData();
}

export {
  saveWorkoutLog,
  getWorkoutLogs,
  getExerciseProgressions,
  getUserProfile,
  saveUserProfile,
  resetToDefaultData,
};

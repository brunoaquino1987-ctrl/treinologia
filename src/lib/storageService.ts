import {
  UserProfile,
  WorkoutLog,
  ExerciseProgression,
  Workout,
  Exercise,
} from '../types';
import { INITIAL_USER, WORKOUTS_PROGRAM, CYCLE_WEEKS_CONFIG } from '../data/initialData';
import { generateSampleLogs, generateInitialProgressions } from '../data/sampleLogs';

const STORAGE_KEYS = {
  USER: 'treinologia_user_v1',
  LOGS: 'treinologia_logs_v1',
  PROGRESSIONS: 'treinologia_progressions_v1',
  WORKOUTS: 'treinologia_workouts_v1',
  OLD_USER: 'treino_lca_user_v1',
  OLD_LOGS: 'treino_lca_logs_v1',
  OLD_PROGRESSIONS: 'treino_lca_progressions_v1',
  OLD_WORKOUTS: 'treino_lca_workouts_v1',
};

export function getUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER) || localStorage.getItem(STORAGE_KEYS.OLD_USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Erro ao ler perfil:', e);
  }
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
  return INITIAL_USER;
}

export function saveUserProfile(profile: UserProfile): UserProfile {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
  return profile;
}

export function getWorkoutLogs(): WorkoutLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS) || localStorage.getItem(STORAGE_KEYS.OLD_LOGS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler logs:', e);
  }
  const initialLogs = generateSampleLogs();
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(initialLogs));
  return initialLogs;
}

export function saveWorkoutLog(newLog: WorkoutLog): WorkoutLog[] {
  const current = getWorkoutLogs();
  const updated = [newLog, ...current.filter((l) => l.id !== newLog.id)];
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  updateProgressionsFromLog(newLog);
  return updated;
}

export function getExerciseProgressions(): Record<string, ExerciseProgression> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESSIONS) || localStorage.getItem(STORAGE_KEYS.OLD_PROGRESSIONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Erro ao ler progressões:', e);
  }
  const initial = generateInitialProgressions();
  localStorage.setItem(STORAGE_KEYS.PROGRESSIONS, JSON.stringify(initial));
  return initial;
}

export function updateProgressionsFromLog(log: WorkoutLog) {
  const progressions = getExerciseProgressions();
  const user = getUserProfile();
  const isDeload = user.currentWeek === 8;

  log.exercises.forEach((exLog) => {
    const completedSets = exLog.sets.filter((s) => s.completed && s.reps > 0);
    if (completedSets.length === 0) return;

    let maxWeight = 0;
    let repsAtMax = 0;

    completedSets.forEach((s) => {
      if (s.weight >= maxWeight) {
        maxWeight = s.weight;
        repsAtMax = s.reps;
      }
    });

    if (maxWeight <= 0) return;

    const workoutObj = WORKOUTS_PROGRAM.find((w) => w.id === log.workoutId);
    const exObj = workoutObj?.exercises.find((e) => e.id === exLog.exerciseId);
    const isCompound = exObj ? exObj.type === 'composto' : true;

    let increment = 0;
    if (!isDeload && user.currentWeek >= 4 && user.currentWeek <= 7) {
      increment = isCompound ? 2.5 : 1.0;
    }

    const nextWeight = Math.round((maxWeight + increment) * 2) / 2;
    const nextReps = exObj ? exObj.repRange[0] : 8;

    progressions[exLog.exerciseId] = {
      userId: user.uid,
      exerciseId: exLog.exerciseId,
      lastWeight: maxWeight,
      lastReps: repsAtMax,
      nextTargetWeight: nextWeight,
      nextTargetReps: nextReps,
      updatedAt: new Date().toISOString(),
    };
  });

  localStorage.setItem(STORAGE_KEYS.PROGRESSIONS, JSON.stringify(progressions));
}

export function getWorkoutsProgram(): Workout[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS) || localStorage.getItem(STORAGE_KEYS.OLD_WORKOUTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Erro ao ler programa de treinos:', e);
  }
  return WORKOUTS_PROGRAM;
}

export function resetToDefaultData(): { profile: UserProfile; logs: WorkoutLog[] } {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
  const sampleLogs = generateSampleLogs();
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(sampleLogs));
  const sampleProgressions = generateInitialProgressions();
  localStorage.setItem(STORAGE_KEYS.PROGRESSIONS, JSON.stringify(sampleProgressions));
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(WORKOUTS_PROGRAM));

  return { profile: INITIAL_USER, logs: sampleLogs };
}

export function getAclRecoveryStats(dateStr?: string) {
  const currentWeek = 4;
  return {
    diffDays: 45,
    diffWeeks: 6,
    diffMonths: '1.5',
    phaseName: 'Fase de Hipertrofia & Alta Performance',
    statusBadge: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
}

export function getWorkoutStreakAndStats(logs: WorkoutLog[]) {
  if (!logs || logs.length === 0) {
    return { currentStreak: 0, totalWorkouts: 0, weeklyVolumeKg: 0, workoutsThisWeek: 0, missedDaysAlert: false };
  }

  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const datesSet = new Set(sorted.map((l) => l.date));

  let streak = 0;
  let checkDate = new Date(today);

  const todayStr = checkDate.toISOString().split('T')[0];
  if (!datesSet.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (datesSet.has(checkDate.toISOString().split('T')[0])) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const logsLast7Days = sorted.filter((l) => new Date(l.date) >= sevenDaysAgo);
  const workoutsThisWeek = logsLast7Days.length;
  const weeklyVolumeKg = logsLast7Days.reduce((acc, l) => acc + (l.totalVolumeKg || 0), 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  const yStr = yesterday.toISOString().split('T')[0];
  const dbyStr = dayBeforeYesterday.toISOString().split('T')[0];

  const missedDaysAlert = !datesSet.has(todayStr) && !datesSet.has(yStr) && !datesSet.has(dbyStr);

  return {
    currentStreak: streak,
    totalWorkouts: sorted.length,
    weeklyVolumeKg,
    workoutsThisWeek,
    missedDaysAlert,
  };
}

export function getRecommendedWeightAndSets(
  exercise: Exercise,
  userWeek: number,
  progression?: ExerciseProgression
): { targetWeight: number; targetReps: number; targetSets: number; isDeload: boolean } {
  const weekConfig = CYCLE_WEEKS_CONFIG[userWeek] || CYCLE_WEEKS_CONFIG[1];
  const isDeload = weekConfig.phase === 'deload';

  let baseWeight = progression ? progression.lastWeight : 15;
  if (progression && progression.nextTargetWeight && userWeek >= 4 && !isDeload) {
    baseWeight = progression.nextTargetWeight;
  }

  if (isDeload) {
    const deloadSets = Math.max(2, Math.floor(exercise.sets * 0.5));
    const deloadWeight = Math.round(baseWeight * 0.75 * 2) / 2;
    return {
      targetWeight: Math.max(2, deloadWeight),
      targetReps: exercise.repRange[1],
      targetSets: deloadSets,
      isDeload: true,
    };
  }

  let reps = exercise.repRange[0];
  if (userWeek <= 3) {
    reps = exercise.repRange[1];
  }

  return {
    targetWeight: baseWeight,
    targetReps: reps,
    targetSets: exercise.sets,
    isDeload: false,
  };
}

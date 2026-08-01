export type ExerciseType = 'composto' | 'isolador' | 'core';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repRange: [number, number]; // e.g. [8, 10]
  restSeconds: number;
  type: ExerciseType;
  kneeSensitive?: boolean;
  instructions?: string;
  muscleGroup: string;
}

export interface AlternativeSwap {
  originalExerciseId: string;
  originalName: string;
  alternatives: {
    id: string;
    name: string;
    description: string;
  }[];
}

export interface Workout {
  id: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b';
  name: string;
  subtitle: string;
  dayOfWeek: number; // 1 (Segunda) to 5 (Sexta)
  exercises: Exercise[];
}

export interface SetLog {
  setNumber: number;
  targetWeight: number;
  targetReps: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  substitutedFromId?: string;
  sets: SetLog[];
  rpe?: number; // 1 to 10
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b';
  workoutName: string;
  date: string; // ISO string YYYY-MM-DD
  startTime: string; // ISO string
  endTime?: string;
  durationMinutes: number;
  exercises: ExerciseLog[];
  totalVolumeKg: number;
  notes?: string;
}

export interface ExerciseProgression {
  userId: string;
  exerciseId: string;
  lastWeight: number;
  lastReps: number;
  nextTargetWeight: number;
  nextTargetReps: number;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  createdAt: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  goal: string;
  currentCycle: number; // Ex: Ciclo 1
  currentWeek: number; // 1 a 8
  reminderTime: string; // e.g. "17:00"
  notificationsEnabled: boolean;
}

export type CyclePhase = 'adaptação' | 'hipertrofia' | 'pico_intensidade' | 'deload';

export interface CycleWeekInfo {
  weekNumber: number;
  phase: CyclePhase;
  title: string;
  description: string;
  volumeMultiplier: number; // e.g. 1.0 or 0.5 for deload
  weightAdvice: string;
}

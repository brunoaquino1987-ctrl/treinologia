import { UserProfile, WorkoutLog, Workout } from '../types';

export interface GeminiOverloadSuggestion {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  actionType: 'increase_weight' | 'increase_reps' | 'maintain_form' | 'deload_recovery';
  lastPerformance: string;
  nextTarget: string;
  recommendedWeight: number;
  recommendedReps: number;
  recommendedSets: number;
  rationale: string;
  priority: 'alta' | 'média' | 'baixa';
  kneeCaution?: string | null;
  biomechanicalTip: string;
}

export interface GeminiOverloadResponse {
  coachSummary: string;
  readinessScore: number;
  overallStrategy: string;
  targetWorkout: {
    id: string;
    name: string;
  };
  suggestions: GeminiOverloadSuggestion[];
  weeklyFocus: string[];
  timestamp: string;
  aiPowered?: boolean;
  isFallback?: boolean;
  errorNotice?: string;
}

const CACHE_KEY = 'treinologia_gemini_suggestions_v1';
const APPLIED_SUGGESTIONS_KEY = 'treinologia_applied_suggestions_v1';

export function getCachedAiSuggestions(): GeminiOverloadResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler cache de sugestões de IA:', e);
  }
  return null;
}

export function saveCachedAiSuggestions(data: GeminiOverloadResponse): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar cache de sugestões de IA:', e);
  }
}

export function getAppliedSuggestionIds(): string[] {
  try {
    const raw = localStorage.getItem(APPLIED_SUGGESTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler sugestões aplicadas:', e);
  }
  return [];
}

export function toggleAppliedSuggestionId(exerciseId: string): string[] {
  const current = getAppliedSuggestionIds();
  const updated = current.includes(exerciseId)
    ? current.filter((id) => id !== exerciseId)
    : [...current, exerciseId];
  try {
    localStorage.setItem(APPLIED_SUGGESTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao salvar sugestão aplicada:', e);
  }
  return updated;
}

export async function fetchProgressiveOverloadSuggestions(
  user: UserProfile,
  logs: WorkoutLog[],
  workouts: Workout[],
  targetWorkoutId?: string
): Promise<GeminiOverloadResponse> {
  const effectiveTargetId = targetWorkoutId || 'push';

  const response = await fetch('/api/ai/progressive-overload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user,
      logs,
      workouts,
      targetWorkoutId: effectiveTargetId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Falha no servidor ao processar análise de IA: ${response.statusText}`);
  }

  const data: GeminiOverloadResponse = await response.json();
  saveCachedAiSuggestions(data);
  return data;
}

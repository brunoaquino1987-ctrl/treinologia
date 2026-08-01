import { WorkoutLog, ExerciseLog } from '../types';
import { WORKOUTS_PROGRAM } from '../data/initialData';
import { EXERCISE_ALTERNATIVES_BY_MUSCLE } from '../data/exerciseAlternatives';

/**
 * Tenta identificar o grupo muscular de um exercício caso ele não esteja gravado diretamente no log.
 */
export function getMuscleGroupForExercise(exerciseId: string, exerciseName: string = ''): string {
  // Search in workouts program
  for (const w of WORKOUTS_PROGRAM) {
    for (const ex of w.exercises) {
      if (ex.id === exerciseId || ex.name.toLowerCase() === exerciseName.toLowerCase()) {
        return ex.muscleGroup;
      }
    }
  }

  // Search in alternatives
  for (const [group, list] of Object.entries(EXERCISE_ALTERNATIVES_BY_MUSCLE)) {
    for (const alt of list) {
      if (alt.id === exerciseId || alt.name.toLowerCase() === exerciseName.toLowerCase()) {
        return group;
      }
    }
  }

  // Fallbacks using keywords
  const lower = (exerciseName || exerciseId).toLowerCase();
  if (lower.includes('supino') || lower.includes('crucifixo') || lower.includes('crossover') || lower.includes('peito')) return 'Peitoral';
  if (lower.includes('puxada') || lower.includes('remada') || lower.includes('pulldown') || lower.includes('costas')) return 'Dorsais';
  if (lower.includes('agachamento') || lower.includes('leg press') || lower.includes('extensora') || lower.includes('quadriceps')) return 'Quadríceps';
  if (lower.includes('stiff') || lower.includes('flexora') || lower.includes('posterior') || lower.includes('isquiotibiais')) return 'Isquiotibiais';
  if (lower.includes('elevação lateral') || lower.includes('desenvolvimento') || lower.includes('ombro') || lower.includes('deltoide')) return 'Deltoides';
  if (lower.includes('tríceps') || lower.includes('triceps') || lower.includes('testa') || lower.includes('corda')) return 'Tríceps';
  if (lower.includes('bíceps') || lower.includes('biceps') || lower.includes('rosca')) return 'Bíceps';
  if (lower.includes('prancha') || lower.includes('abdominal') || lower.includes('core')) return 'Core';
  if (lower.includes('panturrilha') || lower.includes('gêmeos')) return 'Panturrilhas';
  if (lower.includes('elevação pélvica') || lower.includes('glúteo')) return 'Glúteos';

  return 'Musculação';
}

/**
 * Retorna todos os grupos musculares trabalhados em um treino.
 */
export function getMuscleGroupsFromLog(log: WorkoutLog): string[] {
  const groups = new Set<string>();

  if (log.exercises) {
    log.exercises.forEach((exLog) => {
      const group = exLog.muscleGroup || getMuscleGroupForExercise(exLog.exerciseId, exLog.exerciseName);
      if (group) groups.add(group);
    });
  }

  return Array.from(groups);
}

/**
 * Retorna estatísticas de execução de um exercício (séries concluídas, maior carga e reps com maior carga).
 */
export function getExerciseLogSummary(exLog: ExerciseLog) {
  const completed = (exLog.sets || []).filter((s) => s.completed && s.reps > 0);
  const setsCount = completed.length || (exLog.sets ? exLog.sets.length : 0);

  let maxWeight = 0;
  let repsAtMax = 0;

  (exLog.sets || []).forEach((s) => {
    if (s.completed && s.weight >= maxWeight) {
      maxWeight = s.weight;
      repsAtMax = s.reps;
    }
  });

  return {
    setsCompleted: setsCount,
    maxWeight,
    repsAtMax,
  };
}

/**
 * Formata texto amigável e estilizado para copiar e postar em redes sociais (WhatsApp, Instagram, etc.)
 */
export function formatWorkoutShareText(log: WorkoutLog, userWeek?: number): string {
  const formattedDate = new Date(log.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const muscleGroups = getMuscleGroupsFromLog(log);
  const muscleGroupsText = muscleGroups.length > 0 ? muscleGroups.join(', ') : 'Musculação';

  const exercisesList = (log.exercises || [])
    .map((ex) => {
      const { setsCompleted, maxWeight, repsAtMax } = getExerciseLogSummary(ex);
      const weightText = maxWeight > 0 ? ` (${maxWeight}kg x ${repsAtMax} reps)` : '';
      return `• ${ex.exerciseName}: ${setsCompleted} series${weightText}`;
    })
    .join('\n');

  const volumeInTons = (log.totalVolumeKg / 1000).toFixed(1);

  return `💪 TREINOLOGIA - Treino Concluído!

📅 Data: ${formattedDate}
🔥 Treino: ${log.workoutName}
🎯 Grupos Malhados: ${muscleGroupsText}
⏱️ Duração: ${log.durationMinutes} min
🏋️ Volume Total: ${log.totalVolumeKg.toLocaleString('pt-BR')} kg (${volumeInTons}t)
${userWeek ? `📈 Semana do Ciclo: Semana ${userWeek}/8` : ''}

📋 Lista dos Exercícios:
${exercisesList}

⚡ Sobrecarga Progressiva e Constância!
#Treinologia #Fitness #Hipertrofia #TreinoConcluido`;
}

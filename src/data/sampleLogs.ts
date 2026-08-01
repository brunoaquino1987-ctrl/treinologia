import { WorkoutLog, ExerciseProgression } from '../types';

// Retorna logs de treino fictícios porém consistentes para o perfil do Bruno
export function generateSampleLogs(): WorkoutLog[] {
  const logs: WorkoutLog[] = [];
  const today = new Date();

  // Gerar treinos dos últimos 40 dias (cerca de 5 treinos por semana)
  // Seg, Ter, Quat, Qui, Sex
  const workoutOrder: ('push' | 'pull' | 'legs_a' | 'upper' | 'legs_b')[] = [
    'push',
    'pull',
    'legs_a',
    'upper',
    'legs_b',
  ];

  let workoutIndex = 0;

  for (let i = 45; i >= 1; i--) {
    const logDate = new Date(today);
    logDate.setDate(today.getDate() - i);

    const dayOfWeek = logDate.getDay(); // 0: Dom, 1: Seg, ..., 6: Sab
    // Pular fins de semana (0 e 6)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const workoutId = workoutOrder[workoutIndex % 5];
    workoutIndex++;

    const dateStr = logDate.toISOString().split('T')[0];
    const weeksAgo = Math.floor(i / 7);
    // Carga evoluindo gradualmente com base em quantas semanas atrás
    const baseWeightBoost = Math.max(0, 4 - weeksAgo) * 2.5;

    let totalVolume = 0;
    const exercisesLog = [];

    if (workoutId === 'push') {
      const weightInclinado = 20 + baseWeightBoost;
      const weightDesenv = 16 + baseWeightBoost;
      totalVolume = (4 * 10 * weightInclinado) + (3 * 10 * 35) + (4 * 10 * weightDesenv) + (3 * 12 * 12) + (3 * 12 * 25) + (3 * 10 * 10);

      exercisesLog.push(
        {
          exerciseId: 'supino_inclinado_halteres',
          exerciseName: 'Supino Inclinado com Halteres',
          sets: [
            { setNumber: 1, targetWeight: weightInclinado, targetReps: 10, weight: weightInclinado, reps: 10, completed: true },
            { setNumber: 2, targetWeight: weightInclinado, targetReps: 10, weight: weightInclinado, reps: 10, completed: true },
            { setNumber: 3, targetWeight: weightInclinado, targetReps: 10, weight: weightInclinado, reps: 9, completed: true },
            { setNumber: 4, targetWeight: weightInclinado, targetReps: 10, weight: weightInclinado, reps: 8, completed: true },
          ],
          rpe: 8,
          notes: 'Sensação ótima no peitoral superior. Ombro firme.',
        },
        {
          exerciseId: 'desenvolvimento_halteres',
          exerciseName: 'Desenvolvimento com Halteres',
          sets: [
            { setNumber: 1, targetWeight: weightDesenv, targetReps: 10, weight: weightDesenv, reps: 10, completed: true },
            { setNumber: 2, targetWeight: weightDesenv, targetReps: 10, weight: weightDesenv, reps: 10, completed: true },
            { setNumber: 3, targetWeight: weightDesenv, targetReps: 10, weight: weightDesenv, reps: 9, completed: true },
            { setNumber: 4, targetWeight: weightDesenv, targetReps: 10, weight: weightDesenv, reps: 8, completed: true },
          ],
          rpe: 8,
          notes: '',
        }
      );
    } else if (workoutId === 'pull') {
      const weightPuxada = 50 + baseWeightBoost * 2;
      const weightRemada = 40 + baseWeightBoost * 2;
      totalVolume = (4 * 10 * weightPuxada) + (4 * 10 * weightRemada) + (3 * 12 * 45) + (3 * 15 * 20) + (3 * 10 * 14) + (3 * 10 * 14);

      exercisesLog.push(
        {
          exerciseId: 'puxada_alta_pronada',
          exerciseName: 'Puxada Alta (Pegada Pronada)',
          sets: [
            { setNumber: 1, targetWeight: weightPuxada, targetReps: 10, weight: weightPuxada, reps: 10, completed: true },
            { setNumber: 2, targetWeight: weightPuxada, targetReps: 10, weight: weightPuxada, reps: 10, completed: true },
            { setNumber: 3, targetWeight: weightPuxada, targetReps: 10, weight: weightPuxada, reps: 10, completed: true },
            { setNumber: 4, targetWeight: weightPuxada, targetReps: 10, weight: weightPuxada, reps: 9, completed: true },
          ],
          rpe: 8,
          notes: 'Músculos das costas respondendo muito bem.',
        },
        {
          exerciseId: 'remada_curvada_barra',
          exerciseName: 'Remada Curvada com Barra',
          sets: [
            { setNumber: 1, targetWeight: weightRemada, targetReps: 10, weight: weightRemada, reps: 10, completed: true },
            { setNumber: 2, targetWeight: weightRemada, targetReps: 10, weight: weightRemada, reps: 10, completed: true },
            { setNumber: 3, targetWeight: weightRemada, targetReps: 10, weight: weightRemada, reps: 9, completed: true },
            { setNumber: 4, targetWeight: weightRemada, targetReps: 10, weight: weightRemada, reps: 8, completed: true },
          ],
          rpe: 8.5,
          notes: '',
        }
      );
    } else if (workoutId === 'legs_a') {
      const weightGoblet = 16 + baseWeightBoost;
      const weightLegPress = 80 + baseWeightBoost * 4;
      totalVolume = (4 * 10 * weightGoblet) + (4 * 10 * weightLegPress) + (3 * 10 * 12) + (3 * 12 * 30) + (4 * 12 * 60) + (3 * 15 * 40);

      exercisesLog.push(
        {
          exerciseId: 'agachamento_goblet',
          exerciseName: 'Agachamento Goblet',
          sets: [
            { setNumber: 1, targetWeight: weightGoblet, targetReps: 10, weight: weightGoblet, reps: 10, completed: true },
            { setNumber: 2, targetWeight: weightGoblet, targetReps: 10, weight: weightGoblet, reps: 10, completed: true },
            { setNumber: 3, targetWeight: weightGoblet, targetReps: 10, weight: weightGoblet, reps: 10, completed: true },
            { setNumber: 4, targetWeight: weightGoblet, targetReps: 10, weight: weightGoblet, reps: 10, completed: true },
          ],
          rpe: 7.5,
          notes: 'Excelente estabilização pélvica e recrutamento muscular.',
        },
        {
          exerciseId: 'leg_press_45',
          exerciseName: 'Leg Press 45°',
          sets: [
            { setNumber: 1, targetWeight: weightLegPress, targetReps: 10, weight: weightLegPress, reps: 10, completed: true },
            { setNumber: 2, targetWeight: weightLegPress, targetReps: 10, weight: weightLegPress, reps: 10, completed: true },
            { setNumber: 3, targetWeight: weightLegPress, targetReps: 10, weight: weightLegPress, reps: 10, completed: true },
            { setNumber: 4, targetWeight: weightLegPress, targetReps: 10, weight: weightLegPress, reps: 10, completed: true },
          ],
          rpe: 8,
          notes: 'Respeitada trava de 90 graus.',
        }
      );
    } else if (workoutId === 'legs_b') {
      const weightStiff = 22 + baseWeightBoost;
      const weightHipThrust = 60 + baseWeightBoost * 3;
      totalVolume = (4 * 10 * weightStiff) + (4 * 12 * 35) + (4 * 10 * weightHipThrust) + (3 * 15 * 45) + (3 * 1 * 0) + (3 * 15 * 30);

      exercisesLog.push(
        {
          exerciseId: 'stiff_halteres',
          exerciseName: 'Stiff com Halteres',
          sets: [
            { setNumber: 1, targetWeight: weightStiff, targetReps: 10, weight: weightStiff, reps: 10, completed: true },
            { setNumber: 2, targetWeight: weightStiff, targetReps: 10, weight: weightStiff, reps: 10, completed: true },
            { setNumber: 3, targetWeight: weightStiff, targetReps: 10, weight: weightStiff, reps: 10, completed: true },
            { setNumber: 4, targetWeight: weightStiff, targetReps: 10, weight: weightStiff, reps: 9, completed: true },
          ],
          rpe: 8,
          notes: 'Isquiotibiais queimando, excelente ativação de cadeia posterior.',
        }
      );
    } else {
      // Upper
      const weightSupinoUpper = 22 + baseWeightBoost;
      totalVolume = (4 * 10 * weightSupinoUpper) + (4 * 10 * 24) + (3 * 12 * 40) + (3 * 10 * 45) + (3 * 10 * 14) + (3 * 12 * 10);

      exercisesLog.push({
        exerciseId: 'supino_reto_halteres',
        exerciseName: 'Supino Reto com Halteres',
        sets: [
          { setNumber: 1, targetWeight: weightSupinoUpper, targetReps: 10, weight: weightSupinoUpper, reps: 10, completed: true },
          { setNumber: 2, targetWeight: weightSupinoUpper, targetReps: 10, weight: weightSupinoUpper, reps: 10, completed: true },
          { setNumber: 3, targetWeight: weightSupinoUpper, targetReps: 10, weight: weightSupinoUpper, reps: 9, completed: true },
          { setNumber: 4, targetWeight: weightSupinoUpper, targetReps: 10, weight: weightSupinoUpper, reps: 8, completed: true },
        ],
        rpe: 8,
        notes: 'Boa força nos tríceps e peitoral.',
      });
    }

    const workoutNameMap: Record<string, string> = {
      push: 'Push (Empurrar)',
      pull: 'Pull (Puxar)',
      legs_a: 'Legs A (Quadríceps + Glúteo)',
      upper: 'Upper (Corpo Superior)',
      legs_b: 'Legs B (Posterior + Glúteo + Core)',
    };

    logs.push({
      id: `log_${dateStr}_${workoutId}`,
      userId: 'bruno_aquino',
      workoutId,
      workoutName: workoutNameMap[workoutId],
      date: dateStr,
      startTime: `${dateStr}T18:00:00.000Z`,
      endTime: `${dateStr}T18:52:00.000Z`,
      durationMinutes: 52,
      exercises: exercisesLog,
      totalVolumeKg: Math.round(totalVolume),
      notes: 'Treino excelente!',
    });
  }

  return logs;
}

export function generateInitialProgressions(): Record<string, ExerciseProgression> {
  return {
    supino_inclinado_halteres: {
      userId: 'bruno_aquino',
      exerciseId: 'supino_inclinado_halteres',
      lastWeight: 22.5,
      lastReps: 10,
      nextTargetWeight: 25.0, // Regra +2.5kg compostos
      nextTargetReps: 8,
      updatedAt: new Date().toISOString(),
    },
    agachamento_goblet: {
      userId: 'bruno_aquino',
      exerciseId: 'agachamento_goblet',
      lastWeight: 18.0,
      lastReps: 12,
      nextTargetWeight: 20.0,
      nextTargetReps: 10,
      updatedAt: new Date().toISOString(),
    },
    stiff_halteres: {
      userId: 'bruno_aquino',
      exerciseId: 'stiff_halteres',
      lastWeight: 24.0,
      lastReps: 12,
      nextTargetWeight: 26.5,
      nextTargetReps: 10,
      updatedAt: new Date().toISOString(),
    },
    puxada_alta_pronada: {
      userId: 'bruno_aquino',
      exerciseId: 'puxada_alta_pronada',
      lastWeight: 55.0,
      lastReps: 10,
      nextTargetWeight: 57.5,
      nextTargetReps: 8,
      updatedAt: new Date().toISOString(),
    },
    leg_press_45: {
      userId: 'bruno_aquino',
      exerciseId: 'leg_press_45',
      lastWeight: 90.0,
      lastReps: 12,
      nextTargetWeight: 95.0,
      nextTargetReps: 10,
      updatedAt: new Date().toISOString(),
    },
  };
}

import { Exercise, Workout, WorkoutLog } from '../types';
import { TREINOS } from '../data/treinos';

export interface ResultProgressao {
  proximaCarga: number;
  proximaReps: number;
  novasSeries: number;
  mensagem: string;
  tipoAjuste: 'incremento' | 'manutencao' | 'reducao' | 'deload';
}

/**
 * Calcula a próxima carga e repetições alvo baseadas no desempenho do exercício e na semana do ciclo.
 * 
 * Regras:
 * 1. Bateu max reps (reps >= maxReps):
 *    - +2.5kg (exercício composto) ou +1.0kg (exercício isolador)
 *    - Reseta o alvo de repetições para minReps
 * 2. Ficou no min reps (minReps <= reps < maxReps):
 *    - Mantém a carga atual
 * 3. Abaixo do min (reps < minReps):
 *    - Reduz a carga (-2.5kg composto ou -1.0kg isolador)
 * 4. Semana 8 (Deload automático):
 *    - Redução de 50% no volume (metade das séries)
 *    - Redução de 25% na carga
 */
export function calcularProgressaoExercicio(
  exercicio: Exercise,
  cargaAtual: number,
  repsRealizadas: number,
  semanaAtual: number = 1
): ResultProgressao {
  const [minReps, maxReps] = exercicio.repRange;
  const isComposto = exercicio.type === 'composto';
  const increment = isComposto ? 2.5 : 1.0;

  // Semana 8: Deload Automático (-50% volume de séries, -25% carga)
  if (semanaAtual === 8) {
    const cargaDeload = Math.max(2, Math.round((cargaAtual * 0.75) * 2) / 2);
    const seriesDeload = Math.max(2, Math.floor(exercicio.sets * 0.5));
    return {
      proximaCarga: cargaDeload,
      proximaReps: minReps,
      novasSeries: seriesDeload,
      mensagem: `⚡ Deload Automático (Semana 8): Carga reduzida em 25% (${cargaDeload}kg) e séries cortadas pela metade (${seriesDeload} séries) para recuperação do enxerto.`,
      tipoAjuste: 'deload',
    };
  }

  // Se bateu ou superou o topo de repetições (maxReps)
  if (repsRealizadas >= maxReps) {
    const novaCarga = Math.round((cargaAtual + increment) * 2) / 2;
    return {
      proximaCarga: novaCarga,
      proximaReps: minReps,
      novasSeries: exercicio.sets,
      mensagem: `🚀 Sobrecarga Progressiva! Meta de ${maxReps} reps atingida. Adicionado +${increment}kg (${novaCarga}kg). Alvo resetado para ${minReps} reps.`,
      tipoAjuste: 'incremento',
    };
  }

  // Se ficou na faixa intermediária ou no mínimo de reps
  if (repsRealizadas >= minReps) {
    return {
      proximaCarga: cargaAtual,
      proximaReps: Math.min(repsRealizadas + 1, maxReps),
      novasSeries: exercicio.sets,
      mensagem: `💪 Carga mantida em ${cargaAtual}kg. Continue evoluindo repetições até atingir ${maxReps} reps.`,
      tipoAjuste: 'manutencao',
    };
  }

  // Se ficou abaixo das repetições mínimas
  const cargaReduzida = Math.max(2, Math.round((cargaAtual - increment) * 2) / 2);
  return {
    proximaCarga: cargaReduzida,
    proximaReps: minReps,
    novasSeries: exercicio.sets,
    mensagem: `⚠️ Repetições abaixo do mínimo (${minReps} reps). Carga reduzida para ${cargaReduzida}kg para proteger a articulação e priorizar a forma.`,
    tipoAjuste: 'reducao',
  };
}

/**
 * Retorna o próximo treino do programa (Push -> Pull -> Legs A -> Upper -> Legs B -> Push ...)
 * 
 * @param arg Opcional: Lista de WorkoutLog ou o id do último treino executado ('push', 'pull', etc.)
 * @param listaTreinos Opcional: Lista customizada de treinos
 */
export function getProximoTreino(
  arg?: WorkoutLog[] | string,
  listaTreinos: Workout[] = TREINOS
): Workout {
  if (!arg) {
    return listaTreinos[0];
  }

  let ultimoId: string = '';
  if (typeof arg === 'string') {
    ultimoId = arg;
  } else if (Array.isArray(arg) && arg.length > 0) {
    // Pega o id do log mais recente
    ultimoId = arg[0].workoutId;
  }

  const orderIndex: Record<string, number> = {
    push: 0,
    pull: 1,
    legs_a: 2,
    upper: 3,
    legs_b: 4,
  };

  const currentIdx = orderIndex[ultimoId] !== undefined ? orderIndex[ultimoId] : -1;
  const nextIdx = (currentIdx + 1) % listaTreinos.length;

  return listaTreinos[nextIdx] || listaTreinos[0];
}

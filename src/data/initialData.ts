import { Workout, UserProfile, CycleWeekInfo } from '../types';
import { TREINOS } from './treinos';

export const INITIAL_USER: UserProfile = {
  uid: 'bruno_aquino',
  name: 'Bruno Aquino',
  createdAt: '2026-01-15T00:00:00.000Z',
  level: 'intermediário',
  goal: 'Hipertrofia & Sobrecarga Progressiva',
  currentCycle: 1,
  currentWeek: 4, // Semana 4: Início da sobrecarga progressiva
  reminderTime: '18:00',
  notificationsEnabled: true,
};

export const CYCLE_WEEKS_CONFIG: Record<number, CycleWeekInfo> = {
  1: {
    weekNumber: 1,
    phase: 'adaptação',
    title: 'Semana 1 — Adaptação & Ajuste de Cargas',
    description: 'Foco na execução perfeita, RPE 7-8. Trabalhar no topo das repetições com carga moderada.',
    volumeMultiplier: 1.0,
    weightAdvice: 'Manter carga constante e focar na cadência de movimento e controle articular.',
  },
  2: {
    weekNumber: 2,
    phase: 'adaptação',
    title: 'Semana 2 — Consolidação Técnica',
    description: 'Manter cargas da Semana 1, buscando completar todas as repetições com facilidade.',
    volumeMultiplier: 1.0,
    weightAdvice: 'Se completou todas as séries com folga, prepare-se para subir semana que vem.',
  },
  3: {
    weekNumber: 3,
    phase: 'adaptação',
    title: 'Semana 3 — Consolidação de Volume',
    description: 'Última semana do bloco de adaptação. Aumente 1 rep em cada série se possível.',
    volumeMultiplier: 1.0,
    weightAdvice: 'Meta de fechar todas as séries com RPE 8.',
  },
  4: {
    weekNumber: 4,
    phase: 'hipertrofia',
    title: 'Semana 4 — Progressão Principal (+2.5kg)',
    description: 'Início da sobrecarga progressiva! Adicione +2.5kg a +5kg nos compostos.',
    volumeMultiplier: 1.0,
    weightAdvice: 'Aumente 2.5kg nos compostos se bateu o topo de reps na Semana 3.',
  },
  5: {
    weekNumber: 5,
    phase: 'hipertrofia',
    title: 'Semana 5 — Sobrecarga Progressiva',
    description: 'Consolide as novas cargas da Semana 4 ou adicione +1 rep.',
    volumeMultiplier: 1.0,
    weightAdvice: 'Manter carga aumentada e focar em amplitude de movimento perfeita.',
  },
  6: {
    weekNumber: 6,
    phase: 'hipertrofia',
    title: 'Semana 6 — Teto de Carga',
    description: 'Desafio do bloco de hipertrofia! Tente novo pico nos isoladores (+1kg a +2kg).',
    volumeMultiplier: 1.0,
    weightAdvice: 'Trabalhe firme na margem de repetições.',
  },
  7: {
    weekNumber: 7,
    phase: 'pico_intensidade',
    title: 'Semana 7 — Pico de Intensidade (Perto da Falha)',
    description: 'Aperte a intensidade (RPE 9). Empurre o máximo com segurança antes do Deload.',
    volumeMultiplier: 1.0,
    weightAdvice: 'Carga máxima controlada. Fique a 1 rep da falha nos exercícios principais.',
  },
  8: {
    weekNumber: 8,
    phase: 'deload',
    title: 'Semana 8 — DELOAD AUTOMÁTICO (Recuperação)',
    description: 'Redução automática de 50% no volume (metade das séries) e 25% na carga. Regeneração muscular e articular.',
    volumeMultiplier: 0.5,
    weightAdvice: 'Use apenas 70-75% da carga habitual. Foco na circulação e recuperação do sistema nervoso central.',
  },
};

export const WORKOUTS_PROGRAM: Workout[] = TREINOS;

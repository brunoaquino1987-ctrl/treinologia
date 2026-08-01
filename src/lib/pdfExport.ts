import { jsPDF } from 'jspdf';
import { Workout, WorkoutLog, UserProfile } from '../types';
import { CYCLE_WEEKS_CONFIG } from '../data/initialData';

export function exportProgramPDF(workouts: Workout[], user: UserProfile) {
  const doc = new jsPDF();
  let y = 15;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PROGRAMA DE TREINO — TREINOLOGIA', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Atleta: ${user.name} | Nível: ${user.level} | Objetivo: ${user.goal}`, 14, 25);

  y = 38;

  const weekInfo = CYCLE_WEEKS_CONFIG[user.currentWeek];
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 18, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`CICLO ATUAL: ${weekInfo ? weekInfo.title : `Semana ${user.currentWeek}`}`, 18, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(weekInfo ? weekInfo.description : '', 18, y + 13);

  y += 26;

  workouts.forEach((w) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(34, 197, 94);
    doc.rect(14, y, 4, 10, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`${w.name.toUpperCase()} — ${w.subtitle}`, 22, y + 8);

    y += 14;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(226, 232, 240);
    doc.rect(14, y, 182, 7, 'F');
    doc.text('Exercício', 16, y + 5);
    doc.text('Músculo', 105, y + 5);
    doc.text('Séries', 145, y + 5);
    doc.text('Reps', 165, y + 5);
    doc.text('Descanso', 185, y + 5);

    y += 8;

    w.exercises.forEach((ex) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);

      doc.text(ex.name.substring(0, 38), 16, y + 4);
      doc.text(ex.muscleGroup ? ex.muscleGroup.substring(0, 18) : 'Geral', 105, y + 4);
      doc.text(`${ex.sets}`, 148, y + 4);
      doc.text(`${ex.repRange[0]}-${ex.repRange[1]}`, 165, y + 4);
      doc.text(`${ex.restSeconds}s`, 185, y + 4);

      y += 6;
    });

    y += 6;
  });

  doc.save(`Programa_Treino_Treinologia_${user.name.replace(/\s+/g, '_')}.pdf`);
}

export function exportWorkoutHistoryPDF(logs: WorkoutLog[], user: UserProfile) {
  const doc = new jsPDF();
  let y = 15;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RELATÓRIO DE EVOLUÇÃO & HISTÓRICO TREINOLOGIA', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Atleta: ${user.name} | Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 24);

  y = 35;

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 25);

  sortedLogs.forEach((log) => {
    if (y > 255) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, 182, 10, 1, 1, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    const dateFormatted = new Date(log.date + 'T12:00:00').toLocaleDateString('pt-BR');
    doc.text(`${dateFormatted} — ${log.workoutName}`, 18, y + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Volume: ${log.totalVolumeKg} kg | Duração: ${log.durationMinutes} min`, 120, y + 6.5);

    y += 13;

    log.exercises.forEach((ex) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const setsStr = ex.sets.map((s) => `${s.weight}kg x ${s.reps}`).join(' | ');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`• ${ex.exerciseName}: ${setsStr}`, 20, y);
      y += 5;
    });

    y += 4;
  });

  doc.save(`Historico_Treinos_Treinologia_${user.name.replace(/\s+/g, '_')}.pdf`);
}

import React, { useState } from 'react';
import { WorkoutLog, UserProfile } from '../types';
import { getMuscleGroupsFromLog, getExerciseLogSummary, formatWorkoutShareText } from '../utils/workoutHelpers';
import { Share2, X, Dumbbell, Copy, Check, Sparkles, Flame } from 'lucide-react';

interface ShareCardModalProps {
  log: WorkoutLog;
  user: UserProfile;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ log, user, onClose }) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(log.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const muscleGroups = getMuscleGroupsFromLog(log);

  const handleCopyText = () => {
    const text = formatWorkoutShareText(log, user.currentWeek);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 my-auto max-h-[90vh] flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-black uppercase italic text-white text-base">Card do Treino para Postar</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Exiba seus grupos musculares e exercícios concluídos
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-xl hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Visual de Compartilhamento (Formatado para Print / Post) */}
        <div className="overflow-y-auto space-y-4 pr-1 grow">
          <div className="bg-zinc-950 border-2 border-green-500/80 rounded-3xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Topo do Card: Logo + Data */}
            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider border-b border-zinc-800/80 pb-3">
              <span className="flex items-center gap-1.5 font-black text-green-400 text-xs">
                <Dumbbell className="w-4 h-4 stroke-[2.5]" />
                TREINO<span className="text-white">LOGIA</span>
              </span>
              <span className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">{formattedDate}</span>
            </div>

            {/* Nome do Treino e Volume Total */}
            <div className="space-y-2 text-center pt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-3.5 py-1 rounded-full border border-green-500/20">
                {log.workoutName}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black italic text-white tracking-tight pt-1">
                {(log.totalVolumeKg / 1000).toFixed(1)}<span className="text-sm font-normal text-zinc-500 italic">t acumuladas</span>
              </h2>
            </div>

            {/* Grupos Musculares Trabalhados */}
            <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-green-400" />
                Grupos Musculares Malhados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {muscleGroups.map((group) => (
                  <span
                    key={group}
                    className="text-xs font-black uppercase bg-green-500 text-black px-3 py-0.5 rounded-xl shadow-sm"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>

            {/* Métricas do Treino */}
            <div className="grid grid-cols-2 gap-3 text-left bg-zinc-900/90 p-3.5 rounded-2xl border border-zinc-800/80 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] font-black uppercase tracking-widest">Duração</span>
                <span className="font-black italic text-base text-white">{log.durationMinutes} min</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] font-black uppercase tracking-widest">Ciclo Atual</span>
                <span className="font-black italic text-base text-green-400">Semana {user.currentWeek}/8</span>
              </div>
            </div>

            {/* Lista dos Exercícios Concluídos */}
            <div className="space-y-2 pt-1 border-t border-zinc-800/80">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                Exercícios Concluídos ({(log.exercises || []).length}):
              </span>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(log.exercises || []).map((ex, idx) => {
                  const { setsCompleted, maxWeight, repsAtMax } = getExerciseLogSummary(ex);
                  return (
                    <div
                      key={idx}
                      className="bg-zinc-900 border border-zinc-800/80 px-3 py-2 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></span>
                        <span className="font-bold text-white truncate">{ex.exerciseName}</span>
                      </div>

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

            <div className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic pt-1">
              "Sobrecarga progressiva & constância diária"
            </div>
          </div>
        </div>

        {/* Ações de Compartilhamento */}
        <div className="space-y-2 shrink-0 pt-1 border-t border-zinc-800">
          <button
            onClick={handleCopyText}
            className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              copied
                ? 'bg-zinc-800 text-green-400 border border-green-500'
                : 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                Texto Copiado para Postar! 📋
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Resumo em Texto para Postar
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black uppercase tracking-wider py-3 rounded-2xl text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

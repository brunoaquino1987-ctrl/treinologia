import React from 'react';
import { WorkoutLog, UserProfile } from '../types';
import { Share2, X, Dumbbell, Sparkles } from 'lucide-react';

interface ShareCardModalProps {
  log: WorkoutLog;
  user: UserProfile;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ log, user, onClose }) => {
  const formattedDate = new Date(log.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-500" />
            <h3 className="font-black uppercase italic text-white text-base">Compartilhar Progresso</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card de Compartilhamento Estilizado */}
        <div className="bg-zinc-950 border-2 border-green-500 rounded-3xl p-6 space-y-4 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-green-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1 font-black text-green-400">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
              TREINO<span className="text-white">LOGIA</span>
            </span>
            <span>{formattedDate}</span>
          </div>

          <div className="space-y-1 py-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              {log.workoutName}
            </span>
            <h2 className="text-4xl font-black italic text-white tracking-tight pt-2">
              {(log.totalVolumeKg / 1000).toFixed(1)}<span className="text-sm font-normal text-zinc-500 italic">t acumuladas</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] font-black uppercase tracking-widest">Duração</span>
              <span className="font-black italic text-base text-white">{log.durationMinutes} min</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] font-black uppercase tracking-widest">Semana do Ciclo</span>
              <span className="font-black italic text-base text-green-400">Semana {user.currentWeek}</span>
            </div>
          </div>

          <div className="pt-2 text-xs font-bold text-zinc-400 uppercase tracking-wider italic">
            "Sobrecarga progressiva & constância!"
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider py-3.5 rounded-2xl text-xs shadow-lg shadow-green-500/20 transition-all font-bold"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};

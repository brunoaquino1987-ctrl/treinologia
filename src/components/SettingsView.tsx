import React, { useState } from 'react';
import { UserProfile, WorkoutLog, Workout } from '../types';
import { saveUserProfile, resetToDefaultData } from '../services/storageService';
import { exportProgramPDF, exportWorkoutHistoryPDF } from '../utils/pdfExport';
import { Settings, FileText, RotateCcw, User, Check } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  logs: WorkoutLog[];
  workouts: Workout[];
  onProfileUpdated: (updated: UserProfile) => void;
  onDataReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  logs,
  workouts,
  onProfileUpdated,
  onDataReset,
}) => {
  const [name, setName] = useState(user.name);
  const [currentWeek, setCurrentWeek] = useState(user.currentWeek);
  const [goal, setGoal] = useState(user.goal || 'Hipertrofia & Sobrecarga Progressiva');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      goal,
      currentWeek: Number(currentWeek),
    };

    saveUserProfile(updated);
    onProfileUpdated(updated);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Header de Ajustes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-1 shadow-2xl">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">Configurações</p>
        <div className="flex items-center gap-2 text-white font-black text-2xl uppercase italic tracking-tight">
          <Settings className="w-6 h-6 text-green-500" />
          <h2>Ajustes do Perfil</h2>
        </div>
        <p className="text-xs text-zinc-400 font-medium">
          Gerencie suas informações do atleta, semana do ciclo e exportação em PDF.
        </p>
      </div>

      {/* Formulário do Perfil */}
      <form onSubmit={handleSaveProfile} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-black uppercase italic text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <User className="w-5 h-5 text-green-500" />
          Dados Pessoais & Ciclo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Nome do Atleta</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 text-white text-xs font-bold rounded-2xl px-4 py-3 border border-zinc-800 focus:border-green-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Objetivo Principal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-zinc-950 text-white text-xs font-bold rounded-2xl px-4 py-3 border border-zinc-800 focus:border-green-500 outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Semana Atual do Ciclo (1 a 8)</label>
            <select
              value={currentWeek}
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
              className="w-full bg-zinc-950 text-green-400 text-xs font-black uppercase tracking-wider rounded-2xl px-4 py-3 border border-zinc-800 focus:border-green-500 outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                <option key={w} value={w}>
                  Semana {w} {w === 8 ? '(DELOAD AUTOMÁTICO)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all font-bold"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                Salvo com Sucesso!
              </>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </form>

      {/* Exportação em PDF */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-black uppercase italic text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <FileText className="w-5 h-5 text-green-500" />
          Exportar Relatórios em PDF
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => exportProgramPDF(workouts, user)}
            className="bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-white p-5 rounded-2xl text-left space-y-1.5 transition-all group"
          >
            <span className="font-black uppercase tracking-wider text-xs text-green-400 block group-hover:text-green-300">
              📄 Exportar Programa de Treino
            </span>
            <span className="text-xs text-zinc-400 font-medium block leading-relaxed">
              Gerar PDF completo com as 5 divisões de treino e dados de carga.
            </span>
          </button>

          <button
            onClick={() => exportWorkoutHistoryPDF(logs, user)}
            className="bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-white p-5 rounded-2xl text-left space-y-1.5 transition-all group"
          >
            <span className="font-black uppercase tracking-wider text-xs text-green-400 block group-hover:text-green-300">
              📊 Exportar Histórico & Evolução
            </span>
            <span className="text-xs text-zinc-400 font-medium block leading-relaxed">
              PDF contendo os registros detalhados das cargas de cada sessão.
            </span>
          </button>
        </div>
      </div>

      {/* Reset de Dados de Amostra */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-3">
        <h3 className="text-base font-black uppercase italic text-red-400 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-red-400" />
          Restaurar Dados Padrão do Bruno
        </h3>
        <p className="text-xs text-zinc-400 font-medium leading-relaxed">
          Reinicia o aplicativo para o estado padrão com dados fictícios ricos de 45 dias de treinos para visualização imediata da evolução.
        </p>

        <button
          onClick={() => {
            if (confirm('Deseja realmente restaurar os dados padrão do Bruno Aquino?')) {
              onDataReset();
            }
          }}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-black uppercase tracking-wider px-5 py-2.5 rounded-2xl text-xs transition-all"
        >
          Restaurar Dados Iniciais
        </button>
      </div>
    </div>
  );
};

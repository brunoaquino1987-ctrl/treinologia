import React, { useState } from 'react';
import { EXERCISE_ALTERNATIVES_BY_MUSCLE } from '../data/exerciseAlternatives';
import { Repeat, Search, Dumbbell, ShieldCheck, CheckCircle2, Info, Sparkles } from 'lucide-react';

export const KneeRecoveryView: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const muscleGroups = ['Todos', ...Object.keys(EXERCISE_ALTERNATIVES_BY_MUSCLE)];

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Header do Guia */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Catálogo de Substituições</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center shrink-0">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
              Guia de Exercícios & Substitutos
            </h2>
            <p className="text-xs text-zinc-400 font-medium">
              Substitua qualquer exercício por alternativas do mesmo grupo muscular diretamente durante a execução do treino.
            </p>
          </div>
        </div>
      </div>

      {/* Dicas de Seleção e Substituição */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-green-400 font-black uppercase tracking-wider text-xs">
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            <span>Substituição em 1 Clique</span>
          </div>
          <p className="text-xs text-zinc-300 font-medium leading-relaxed">
            Na tela de treino, clique no ícone de <strong className="text-white font-bold">Trocar Exercício</strong> ao lado de qualquer nome para ver sugestões do mesmo músculo e manter a carga/séries preenchidas.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-green-400 font-black uppercase tracking-wider text-xs">
            <Sparkles className="w-4 h-4 stroke-[3]" />
            <span>Manutenção do Estímulo</span>
          </div>
          <p className="text-xs text-zinc-300 font-medium leading-relaxed">
            A troca preserva a equivalência biomecânica (composto por composto, ou isolador por isolador) garantindo que seu volume semanal permaneça otimizado.
          </p>
        </div>
      </div>

      {/* Busca e Filtros por Músculo */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">Filtro do Catálogo</p>
            <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-green-500" />
              Exercícios Sugeridos por Músculo
            </h3>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar exercício..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 text-white text-xs font-bold rounded-2xl pl-10 pr-4 py-2.5 border border-zinc-800 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* Chips dos Grupos Musculares */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {muscleGroups.map((group) => {
            const isSelected = selectedMuscle === group;
            return (
              <button
                key={group}
                onClick={() => setSelectedMuscle(group)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all ${
                  isSelected
                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/20'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>

        {/* Lista de Grupos Musculares & Exercícios */}
        <div className="space-y-6 pt-2">
          {Object.entries(EXERCISE_ALTERNATIVES_BY_MUSCLE)
            .filter(([muscle]) => selectedMuscle === 'Todos' || selectedMuscle === muscle)
            .map(([muscle, exercises]) => {
              const filteredList = exercises.filter(
                (ex) =>
                  ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  ex.description.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredList.length === 0) return null;

              return (
                <div key={muscle} className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      <h4 className="text-sm font-black uppercase tracking-wider text-white">{muscle}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                      {filteredList.length} exercícios
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {filteredList.map((alt) => (
                      <div
                        key={alt.id}
                        className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-black uppercase text-green-400">{alt.name}</h5>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              alt.type === 'composto'
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : alt.type === 'isolador'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            }`}
                          >
                            {alt.type}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 font-medium leading-relaxed">{alt.description}</p>

                        {alt.instructions && (
                          <div className="bg-zinc-950 rounded-lg p-2.5 border border-zinc-800/50 text-[11px] text-zinc-400 font-medium flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                            <span>{alt.instructions}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

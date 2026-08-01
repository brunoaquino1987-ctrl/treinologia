import React from 'react';
import { UserProfile, WorkoutLog, Workout } from '../types';
import { getWorkoutStreakAndStats } from '../services/storageService';
import { CYCLE_WEEKS_CONFIG } from '../data/initialData';
import {
  Flame,
  ShieldCheck,
  AlertTriangle,
  Play,
  ChevronRight,
  Info,
  Dumbbell,
  Repeat,
  TrendingUp,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  logs: WorkoutLog[];
  workouts: Workout[];
  onStartWorkout: (workoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b') => void;
  onNavigateTab: (tab: 'dashboard' | 'workout' | 'analytics' | 'knee' | 'settings') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  logs,
  workouts,
  onStartWorkout,
  onNavigateTab,
}) => {
  const streakStats = getWorkoutStreakAndStats(logs);
  const weekInfo = CYCLE_WEEKS_CONFIG[user.currentWeek] || CYCLE_WEEKS_CONFIG[1];

  // Determinar o treino sugerido de hoje com base no dia da semana ou no último treino
  const todayDay = new Date().getDay(); // 0: Dom, 1: Seg, 2: Ter, 3: Qua, 4: Qui, 5: Sex, 6: Sáb
  let suggestedWorkoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b' = 'push';

  if (todayDay === 1) suggestedWorkoutId = 'push';
  else if (todayDay === 2) suggestedWorkoutId = 'pull';
  else if (todayDay === 3) suggestedWorkoutId = 'legs_a';
  else if (todayDay === 4) suggestedWorkoutId = 'upper';
  else if (todayDay === 5) suggestedWorkoutId = 'legs_b';
  else {
    // Fim de semana: pegar com base no último log
    const lastLog = logs.length > 0 ? logs[0] : null;
    if (lastLog) {
      if (lastLog.workoutId === 'push') suggestedWorkoutId = 'pull';
      else if (lastLog.workoutId === 'pull') suggestedWorkoutId = 'legs_a';
      else if (lastLog.workoutId === 'legs_a') suggestedWorkoutId = 'upper';
      else if (lastLog.workoutId === 'upper') suggestedWorkoutId = 'legs_b';
      else suggestedWorkoutId = 'push';
    }
  }

  const suggestedWorkout = workouts.find((w) => w.id === suggestedWorkoutId) || workouts[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Banner Principal */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 border border-zinc-700">
                <Flame className="w-3.5 h-3.5 text-green-400 fill-green-400" />
                {streakStats.currentStreak} dias de streak
              </span>
              <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/20 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                Semana {user.currentWeek} do Ciclo
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase text-white">
              Bora treinar, <span className="text-zinc-600">{user.name.split(' ')[0]}!</span>
            </h2>

            <p className="text-zinc-300 text-sm font-medium leading-relaxed">
              Foco na sobrecarga progressiva e hipertrofia com edições diretas de carga e substituição livre de exercícios. Hoje é dia de{' '}
              <strong className="text-green-400 font-black uppercase italic">{suggestedWorkout.name}</strong>.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-3">
            <button
              onClick={() => onStartWorkout(suggestedWorkout.id)}
              className="bg-green-500 hover:bg-green-400 active:scale-95 text-black px-8 py-4 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-tight flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 transition-all group"
            >
              <Play className="w-6 h-6 fill-black group-hover:scale-110 transition-transform" />
              <span>Iniciar Treino</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alerta de dias pulados */}
      {streakStats.missedDaysAlert && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs font-bold">
            <h4 className="text-amber-300 uppercase tracking-wider font-black">Atenção ao ritmo de treinos!</h4>
            <p className="text-amber-200/80 mt-1 font-medium">
              Você pulou 2 dias seguidos. A consistência no estímulo e no controle de carga é fundamental para o ganho contínuo.
            </p>
          </div>
        </div>
      )}

      {/* Seção da Periodização do Ciclo (Semana 1 a 8) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">Periodização do Ciclo</p>
            <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
              {weekInfo.title}
            </h3>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
            Fase: <strong className="text-green-400 font-black">{weekInfo.phase.replace('_', ' ')}</strong>
          </span>
        </div>

        {/* Linha de Progresso de Semanas (1-8 Stepper) */}
        <div className="grid grid-cols-8 gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
            const isCurrent = user.currentWeek === w;
            const isPassed = user.currentWeek > w;
            const isDeloadWeek = w === 8;

            return (
              <div key={w} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-full h-3 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-green-500 ring-2 ring-green-400/50 ring-offset-2 ring-offset-zinc-900'
                      : isPassed
                      ? 'bg-green-600'
                      : isDeloadWeek
                      ? 'bg-amber-500/40 border border-amber-500/60'
                      : 'bg-zinc-800'
                  }`}
                />
                <span
                  className={`text-[10px] font-mono font-black uppercase ${
                    isCurrent
                      ? 'text-green-400'
                      : isDeloadWeek
                      ? 'text-amber-400'
                      : 'text-zinc-500'
                  }`}
                >
                  S{w}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dica da semana */}
        <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800/80 text-xs flex items-start gap-3 text-zinc-300">
          <Info className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-zinc-200">{weekInfo.description}</p>
            <p className="text-zinc-400 mt-1 font-medium">💡 Orientações de carga: {weekInfo.weightAdvice}</p>
          </div>
        </div>
      </div>

      {/* Grid de KPIs Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Fase do Ciclo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Semana do Ciclo</p>
          <p className="text-3xl sm:text-4xl font-black italic text-white">
            {user.currentWeek} <span className="text-sm italic text-zinc-600 font-normal">/ 8</span>
          </p>
          <p className="text-[10px] uppercase font-bold text-green-400 tracking-wider truncate">{weekInfo.phase.replace('_', ' ')}</p>
        </div>

        {/* KPI 2: Frequency & Streak */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Streak Ativo</p>
          <p className="text-3xl sm:text-4xl font-black italic text-green-500">
            {streakStats.currentStreak} <span className="text-sm italic text-zinc-600 font-normal">dias</span>
          </p>
          <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">{streakStats.workoutsThisWeek} treinos na semana</p>
        </div>

        {/* KPI 3: Volume Semanal em KG */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Volume Semanal</p>
          <p className="text-3xl sm:text-4xl font-black italic text-white">
            {(streakStats.weeklyVolumeKg / 1000).toFixed(1)}<span className="text-sm italic text-zinc-600 font-normal">t</span>
          </p>
          <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Carga acumulada</p>
        </div>

        {/* KPI 4: Total de Treinos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Frequência</p>
          <p className="text-3xl sm:text-4xl font-black italic text-white">
            {streakStats.totalWorkouts} <span className="text-sm italic text-zinc-600 font-normal">sessões</span>
          </p>
          <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Histórico total</p>
        </div>
      </div>

      {/* Lista das Divisões de Treino (Push / Pull / Legs A / Upper / Legs B) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Rotina Semanal</p>
            <h3 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
              Divisão do Programa (5 Dias)
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('knee')}
            className="text-xs font-bold uppercase tracking-wider text-green-400 hover:text-green-300 flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl"
          >
            Substitutos
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((w) => {
            const isSuggested = w.id === suggestedWorkout.id;

            return (
              <div
                key={w.id}
                className={`bg-zinc-900 rounded-3xl border p-6 flex flex-col justify-between space-y-4 transition-all ${
                  isSuggested
                    ? 'border-green-500/80 ring-1 ring-green-500/40 shadow-xl shadow-green-500/10'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">
                      DIA {w.dayOfWeek}
                    </span>

                    {isSuggested && (
                      <span className="text-[10px] font-black uppercase bg-green-500 text-black px-2.5 py-1 rounded-full tracking-widest">
                        Sugerido
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xl font-black uppercase italic text-white">{w.name}</h4>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{w.subtitle}</p>
                  </div>

                  <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800/80">
                    {w.exercises.slice(0, 4).map((ex) => (
                      <li key={ex.id} className="flex items-center justify-between text-zinc-300">
                        <span className="truncate max-w-[180px] font-medium text-sm">
                          • {ex.name}
                        </span>
                        <span className="font-mono font-bold text-xs text-zinc-400">
                          {ex.sets}x{ex.repRange[0]}-{ex.repRange[1]}
                        </span>
                      </li>
                    ))}
                    {w.exercises.length > 4 && (
                      <li className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider pt-1">
                        + {w.exercises.length - 4} outros exercícios...
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => onStartWorkout(w.id)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isSuggested
                      ? 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Iniciar Treino
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

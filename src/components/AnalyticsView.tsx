import React, { useState, useMemo } from 'react';
import { WorkoutLog, UserProfile, Exercise } from '../types';
import { WORKOUTS_PROGRAM } from '../data/initialData';
import { getMuscleGroupsFromLog, getExerciseLogSummary } from '../utils/workoutHelpers';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  LineChart as LineChartIcon,
  Calendar,
  TrendingUp,
  BarChart3,
  Dumbbell,
  ShieldCheck,
  History,
  Share2,
  Flame,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AnalyticsViewProps {
  logs: WorkoutLog[];
  user: UserProfile;
  onOpenShareModal?: (log: WorkoutLog) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ logs, user, onOpenShareModal }) => {
  const [timeRange, setTimeRange] = useState<'30' | '60' | '90'>('60');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Seleção de exercício para gráfico de evolução de carga
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('agachamento_goblet');

  // Todos os exercícios do programa para o dropdown
  const allExercises = useMemo(() => {
    const map = new Map<string, { id: string; name: string; knee: boolean }>();
    WORKOUTS_PROGRAM.forEach((w) => {
      w.exercises.forEach((ex) => {
        map.set(ex.id, { id: ex.id, name: ex.name, knee: ex.kneeSensitive });
      });
    });
    return Array.from(map.values());
  }, []);

  // Filtrar logs por período (30, 60 ou 90 dias)
  const filteredLogs = useMemo(() => {
    const days = parseInt(timeRange, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return logs
      .filter((l) => new Date(l.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs, timeRange]);

  // Dados do gráfico de evolução de carga do exercício selecionado
  const exerciseLoadData = useMemo(() => {
    const data: { date: string; displayDate: string; weight: number }[] = [];

    filteredLogs.forEach((log) => {
      log.exercises.forEach((exLog) => {
        if (exLog.exerciseId === selectedExerciseId) {
          const completed = exLog.sets.filter((s) => s.completed && s.weight > 0);
          if (completed.length > 0) {
            const maxWeight = Math.max(...completed.map((s) => s.weight));
            const formattedDate = new Date(log.date + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            });

            data.push({
              date: log.date,
              displayDate: formattedDate,
              weight: maxWeight,
            });
          }
        }
      });
    });

    return data;
  }, [filteredLogs, selectedExerciseId]);

  // Dados do volume total por semana
  const weeklyVolumeData = useMemo(() => {
    const weeksMap: Record<string, number> = {};

    filteredLogs.forEach((log) => {
      const d = new Date(log.date + 'T12:00:00');
      // Pegar início da semana
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      const weekKey = monday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      weeksMap[weekKey] = (weeksMap[weekKey] || 0) + (log.totalVolumeKg || 0);
    });

    return Object.keys(weeksMap).map((week) => ({
      week: `Sem ${week}`,
      volume: weeksMap[week],
    }));
  }, [filteredLogs]);

  // Calendário do mês atual (30 dias)
  const calendarDays = useMemo(() => {
    const today = new Date();
    const days = [];
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const logsByDate = new Set(logs.map((l) => l.date));

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dateStr = dateObj.toISOString().split('T')[0];
      const hasWorkout = logsByDate.has(dateStr);
      const isToday = day === today.getDate();

      const log = logs.find((l) => l.date === dateStr);

      days.push({
        day,
        dateStr,
        hasWorkout,
        isToday,
        workoutName: log ? log.workoutName : null,
      });
    }

    return days;
  }, [logs]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header do Dashboard de Análise */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">Métricas & Progresso</p>
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-green-500" />
            Evolução de Carga & Histórico
          </h2>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            Acompanhe a sobrecarga progressiva e a consistência semanal.
          </p>
        </div>

        {/* Seletor de Período (30 / 60 / 90 dias) */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 text-xs font-black uppercase tracking-wider">
          {(['30', '60', '90'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-2 rounded-xl transition-all ${
                timeRange === r
                  ? 'bg-green-500 text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r} Dias
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico 1: Evolução de Carga Por Exercício */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Progressão</p>
            <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Evolução de Carga do Exercício
            </h3>
            <p className="text-xs text-zinc-400 font-medium">
              Maior peso (kg) utilizado em cada sessão nos últimos {timeRange} dias.
            </p>
          </div>

          {/* Dropdown de Exercício */}
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="bg-zinc-950 text-green-400 font-black text-xs uppercase tracking-wider rounded-2xl px-4 py-2.5 border border-zinc-800 outline-none focus:border-green-500"
          >
            {allExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.knee ? '🦵🏼 ' : ''}{ex.name}
              </option>
            ))}
          </select>
        </div>

        {/* Canvas do Gráfico Recharts */}
        <div className="h-64 w-full pt-2">
          {exerciseLoadData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="displayDate" stroke="#71717a" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#71717a" fontSize={11} fontWeight="bold" unit=" kg" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '1rem',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  formatter={(val: number) => [`${val} kg`, 'Carga Máxima']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', r: 5 }}
                  activeDot={{ r: 8, fill: '#4ade80' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-bold uppercase tracking-wider text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              Nenhum registro para este exercício no período selecionado.
            </div>
          )}
        </div>
      </div>

      {/* Gráfico 2: Volume Total Semanal */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Volume Total</p>
          <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-green-500" />
            Volume Semanal Acumulado (kg)
          </h3>
          <p className="text-xs text-zinc-400 font-medium">
            Soma de (séries × repetições × peso) por semana.
          </p>
        </div>

        <div className="h-56 w-full pt-2">
          {weeklyVolumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="week" stroke="#71717a" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#71717a" fontSize={11} fontWeight="bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '1rem',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  formatter={(val: number) => [`${val.toLocaleString()} kg`, 'Volume Total']}
                />
                <Bar dataKey="volume" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              Sem dados de volume no período.
            </div>
          )}
        </div>
      </div>

      {/* Calendário de Dias Treinados */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Consistência</p>
            <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              Calendário Mensal de Treinos
            </h3>
            <p className="text-xs text-zinc-400 font-medium">
              Marcação dos dias com sessões concluídas no mês atual.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              Treino
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-zinc-800 inline-block"></span>
              Off
            </span>
          </div>
        </div>

        {/* Grid do Calendário */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest py-1">
              {day}
            </div>
          ))}

          {calendarDays.map((d) => (
            <div
              key={d.day}
              className={`h-12 rounded-2xl p-2 flex flex-col justify-between border transition-all relative group ${
                d.hasWorkout
                  ? 'bg-green-500/20 border-green-500/60 text-green-400 font-black'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-600 font-bold'
              } ${d.isToday ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-zinc-900' : ''}`}
            >
              <span className="text-[11px] font-mono font-black">{d.day}</span>
              {d.hasWorkout && (
                <span className="w-2 h-2 rounded-full bg-green-400 self-end animate-pulse"></span>
              )}

              {/* Tooltip Hover no dia */}
              {d.workoutName && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-950 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap border border-zinc-700 z-30">
                  {d.workoutName}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Histórico Completo de Treinos Salvos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Registros Salvos</p>
            <h3 className="text-xl font-black uppercase italic text-white flex items-center gap-2">
              <History className="w-5 h-5 text-green-500" />
              Histórico de Treinos Realizados ({logs.length})
            </h3>
            <p className="text-xs text-zinc-400 font-medium">
              Todos os seus treinos concluídos com grupos musculares e lista de exercícios.
            </p>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-bold uppercase text-xs border border-dashed border-zinc-800 rounded-2xl">
            Nenhum treino salvo ainda. Conclua uma sessão para ver seu histórico aqui!
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {[...logs]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((log) => {
                const muscleGroups = getMuscleGroupsFromLog(log);
                const isExpanded = expandedLogId === log.id;
                const formattedDate = new Date(log.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });

                return (
                  <div
                    key={log.id}
                    className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 space-y-3 transition-all"
                  >
                    {/* Topo do Log: Data, Título, Métricas & Botão de Compartilhar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-800">
                            {formattedDate}
                          </span>
                          <span className="text-[10px] font-black uppercase text-green-400">
                            {log.durationMinutes} min
                          </span>
                        </div>
                        <h4 className="text-base font-black uppercase text-white tracking-tight italic">
                          {log.workoutName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black italic text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                          {log.totalVolumeKg.toLocaleString('pt-BR')} kg
                        </span>

                        {onOpenShareModal && (
                          <button
                            onClick={() => onOpenShareModal(log)}
                            className="bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-green-500/10"
                            title="Gerar Card para Redes Sociais"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            Postar
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white p-1.5 rounded-xl border border-zinc-800 transition-all"
                          title="Ver Exercícios"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Grupos Musculares Trabalhados */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-green-500" />
                        Músculos:
                      </span>
                      {muscleGroups.map((group) => (
                        <span
                          key={group}
                          className="text-[10px] font-black uppercase bg-zinc-900 text-green-400 border border-green-500/30 px-2.5 py-0.5 rounded-full"
                        >
                          {group}
                        </span>
                      ))}
                    </div>

                    {/* Detalhes Expansíveis dos Exercícios */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-zinc-900 space-y-2 animate-in fade-in-50">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider block">
                          Exercícios Realizados:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(log.exercises || []).map((ex, idx) => {
                            const { setsCompleted, maxWeight, repsAtMax } = getExerciseLogSummary(ex);
                            return (
                              <div
                                key={idx}
                                className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl flex items-center justify-between text-xs"
                              >
                                <span className="font-bold text-zinc-200 truncate pr-2">
                                  {ex.exerciseName}
                                </span>
                                <div className="flex items-center gap-1.5 text-[11px] font-mono shrink-0">
                                  <span className="text-zinc-400 font-bold">{setsCompleted} series</span>
                                  {maxWeight > 0 && (
                                    <span className="text-green-400 font-black bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                      {maxWeight}kg x {repsAtMax}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

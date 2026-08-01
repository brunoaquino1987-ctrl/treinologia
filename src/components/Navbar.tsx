import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserProfile } from '../types';
import { CYCLE_WEEKS_CONFIG } from '../data/initialData';
import { Dumbbell, Activity, LineChart, Repeat, Settings, TrendingUp } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  isWorkoutActive: boolean;
  onStartWorkoutClick: () => void;
  activeTab?: 'dashboard' | 'workout' | 'analytics' | 'knee' | 'settings';
  setActiveTab?: (tab: 'dashboard' | 'workout' | 'analytics' | 'knee' | 'settings') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isWorkoutActive,
  onStartWorkoutClick,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current active tab based on router location or prop
  const getTabFromPath = (): 'dashboard' | 'workout' | 'analytics' | 'knee' | 'settings' => {
    if (propActiveTab) return propActiveTab;
    const path = location.pathname;
    if (path.startsWith('/workout')) return 'workout';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/knee') || path.startsWith('/exercises')) return 'knee';
    if (path.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getTabFromPath();

  const handleTabChange = (tab: 'dashboard' | 'workout' | 'analytics' | 'knee' | 'settings') => {
    if (propSetActiveTab) propSetActiveTab(tab);
    const targetPath = tab === 'dashboard' ? '/' : `/${tab}`;
    navigate(targetPath);
  };

  const weekInfo = CYCLE_WEEKS_CONFIG[user.currentWeek] || CYCLE_WEEKS_CONFIG[1];
  const isDeload = weekInfo.phase === 'deload';

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-zinc-800 text-zinc-100 shadow-xl">
      {/* Faixa Superior: Status do Ciclo & Alertas */}
      <div className="bg-zinc-900/90 px-4 py-1.5 border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full font-black bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Semana {user.currentWeek}/8
          </span>
          <span className="text-zinc-300 font-bold truncate max-w-[200px] sm:max-w-none">
            {weekInfo.title}
          </span>
          {isDeload && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black animate-pulse">
              ⚠️ DELOAD AUTOMÁTICO (50% Volume)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 bg-green-500/20 text-green-400 border-green-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Sobrecarga Progressiva</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          onClick={() => handleTabChange('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-green-500 font-black shadow-md group-hover:border-green-500/50 transition-all">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-black italic tracking-tighter leading-none text-white">
                TREINO<span className="text-green-500">LOGIA</span>
              </h1>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-bold border border-zinc-700">v1.0</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-0.5 hidden sm:block">
              Hipertrofia & Alta Performance
            </p>
          </div>
        </Link>

        {/* Navigation Tabs - Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-green-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 font-bold'
            }`}
          >
            <Activity className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => handleTabChange('workout')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all relative ${
              activeTab === 'workout'
                ? 'bg-green-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 font-bold'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            Treinar
            {isWorkoutActive && (
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute top-1.5 right-1.5"></span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-green-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 font-bold'
            }`}
          >
            <LineChart className="w-4 h-4" />
            Evolução
          </button>

          <button
            onClick={() => handleTabChange('knee')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'knee'
                ? 'bg-green-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 font-bold'
            }`}
          >
            <Repeat className="w-4 h-4" />
            Exercícios
          </button>

          <button
            onClick={() => handleTabChange('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-green-500 text-black shadow-md font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 font-bold'
            }`}
          >
            <Settings className="w-4 h-4" />
            Ajustes
          </button>
        </nav>

        {/* CTA Botão Treino Rápido */}
        <div className="flex items-center gap-2">
          {!isWorkoutActive ? (
            <button
              onClick={onStartWorkoutClick}
              className="bg-green-500 hover:bg-green-400 active:scale-95 text-black font-black uppercase tracking-wider px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all font-bold"
            >
              <Dumbbell className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Iniciar Treino</span>
              <span className="sm:hidden">Treinar</span>
            </button>
          ) : (
            <button
              onClick={() => handleTabChange('workout')}
              className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 animate-bounce shadow-lg shadow-amber-500/20"
            >
              <Activity className="w-4 h-4 stroke-[3]" />
              Ver Treino
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-zinc-800 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] uppercase font-black tracking-wider ${
            activeTab === 'dashboard' ? 'text-green-500' : 'text-zinc-400'
          }`}
        >
          <Activity className="w-5 h-5" />
          Início
        </button>

        <button
          onClick={() => handleTabChange('workout')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] uppercase font-black tracking-wider relative ${
            activeTab === 'workout' ? 'text-green-500' : 'text-zinc-400'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          Treinar
          {isWorkoutActive && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute top-1 right-2"></span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('analytics')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] uppercase font-black tracking-wider ${
            activeTab === 'analytics' ? 'text-green-500' : 'text-zinc-400'
          }`}
        >
          <LineChart className="w-5 h-5" />
          Evolução
        </button>

        <button
          onClick={() => handleTabChange('knee')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] uppercase font-black tracking-wider ${
            activeTab === 'knee' ? 'text-green-500' : 'text-zinc-400'
          }`}
        >
          <Repeat className="w-5 h-5" />
          Exercícios
        </button>

        <button
          onClick={() => handleTabChange('settings')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] uppercase font-black tracking-wider ${
            activeTab === 'settings' ? 'text-green-500' : 'text-zinc-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          Ajustes
        </button>
      </div>
    </header>
  );
};

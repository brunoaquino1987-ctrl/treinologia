import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserProfile, WorkoutLog, Workout } from '../types';
import { WorkoutExecutionView } from '../components/WorkoutExecutionView';

interface WorkoutPageProps {
  user: UserProfile;
  workouts: Workout[];
  activeWorkoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b' | null;
  onStartWorkout: (workoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b') => void;
  onFinishWorkout: (newLog: WorkoutLog) => void;
  onCancelWorkout: () => void;
  onOpenShareModal: (log: WorkoutLog) => void;
}

export function WorkoutPage({
  user,
  workouts,
  activeWorkoutId,
  onStartWorkout,
  onFinishWorkout,
  onCancelWorkout,
  onOpenShareModal,
}: WorkoutPageProps) {
  const { workoutId } = useParams<{ workoutId?: string }>();
  const navigate = useNavigate();

  const currentWorkoutId = (workoutId as 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b') || activeWorkoutId;
  const activeWorkoutObj = workouts.find((w) => w.id === currentWorkoutId);

  return (
    <div>
      {activeWorkoutObj ? (
        <WorkoutExecutionView
          workout={activeWorkoutObj}
          user={user}
          onFinishWorkout={(log) => {
            onFinishWorkout(log);
            navigate('/');
          }}
          onCancelWorkout={() => {
            onCancelWorkout();
            navigate('/');
          }}
          onOpenShareModal={onOpenShareModal}
        />
      ) : (
        <div className="text-center py-16 space-y-4 max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-green-500 border border-zinc-700 flex items-center justify-center mx-auto text-2xl font-black">
            🏋️
          </div>
          <h3 className="text-xl font-black uppercase italic text-white">Nenhum treino selecionado</h3>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
            Escolha qual divisão do programa deseja executar hoje.
          </p>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {workouts.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  onStartWorkout(w.id as 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b');
                  navigate(`/workout/${w.id}`);
                }}
                className="bg-zinc-950 hover:bg-green-500 hover:text-black border border-zinc-800 text-zinc-200 font-black uppercase p-4 rounded-2xl text-xs transition-all flex items-center justify-between group shadow-md"
              >
                <span className="group-hover:translate-x-1 transition-transform">{w.name}</span>
                <span className="text-[10px] opacity-80 font-semibold">{w.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

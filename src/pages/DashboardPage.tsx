import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, WorkoutLog, Workout } from '../types';
import { DashboardView } from '../components/DashboardView';

interface DashboardPageProps {
  user: UserProfile;
  logs: WorkoutLog[];
  workouts: Workout[];
  onStartWorkout: (workoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b') => void;
}

export function DashboardPage({ user, logs, workouts, onStartWorkout }: DashboardPageProps) {
  const navigate = useNavigate();

  const handleNavigateTab = (tab: 'dashboard' | 'workout' | 'analytics' | 'plyometrics' | 'knee' | 'settings') => {
    if (tab === 'dashboard') navigate('/');
    else navigate(`/${tab}`);
  };

  return (
    <DashboardView
      user={user}
      logs={logs}
      workouts={workouts}
      onStartWorkout={(workoutId) => {
        onStartWorkout(workoutId);
        navigate(`/workout/${workoutId}`);
      }}
      onNavigateTab={handleNavigateTab}
    />
  );
}

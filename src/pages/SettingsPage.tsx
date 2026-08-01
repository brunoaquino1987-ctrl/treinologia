import React from 'react';
import { UserProfile, WorkoutLog, Workout } from '../types';
import { SettingsView } from '../components/SettingsView';

interface SettingsPageProps {
  user: UserProfile;
  logs: WorkoutLog[];
  workouts: Workout[];
  onProfileUpdated: (updated: UserProfile) => void;
  onDataReset: () => void;
}

export function SettingsPage({ user, logs, workouts, onProfileUpdated, onDataReset }: SettingsPageProps) {
  return (
    <SettingsView
      user={user}
      logs={logs}
      workouts={workouts}
      onProfileUpdated={onProfileUpdated}
      onDataReset={onDataReset}
    />
  );
}

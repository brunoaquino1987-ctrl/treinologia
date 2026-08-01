import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProfile, WorkoutLog, Workout } from './types';
import {
  getUserProfile,
  getWorkoutLogs,
  getWorkoutsProgram,
  resetToDefaultData,
} from './lib/storageService';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { KneeRecoveryPage } from './pages/KneeRecoveryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShareCardModal } from './components/ShareCardModal';

export default function App() {
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  const [logs, setLogs] = useState<WorkoutLog[]>(getWorkoutLogs());
  const [workouts, setWorkouts] = useState<Workout[]>(getWorkoutsProgram());

  const [activeWorkoutId, setActiveWorkoutId] = useState<'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b' | null>(null);
  const [shareModalLog, setShareModalLog] = useState<WorkoutLog | null>(null);

  const reloadData = () => {
    setUser(getUserProfile());
    setLogs(getWorkoutLogs());
    setWorkouts(getWorkoutsProgram());
  };

  const handleStartWorkout = (workoutId: 'push' | 'pull' | 'legs_a' | 'upper' | 'legs_b') => {
    setActiveWorkoutId(workoutId);
  };

  const handleFinishWorkout = (_newLog: WorkoutLog) => {
    setActiveWorkoutId(null);
    reloadData();
  };

  const handleCancelWorkout = () => {
    if (confirm('Deseja cancelar o treino em andamento? O progresso desta sessão não será salvo.')) {
      setActiveWorkoutId(null);
    }
  };

  const handleDataReset = () => {
    const { profile, logs: sampleLogs } = resetToDefaultData();
    setUser(profile);
    setLogs(sampleLogs);
    setActiveWorkoutId(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans antialiased selection:bg-green-500 selection:text-black">
        <Navbar
          user={user}
          isWorkoutActive={!!activeWorkoutId}
          onStartWorkoutClick={() => {
            if (!activeWorkoutId) {
              handleStartWorkout('push');
            }
          }}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  user={user}
                  logs={logs}
                  workouts={workouts}
                  onStartWorkout={handleStartWorkout}
                />
              }
            />
            <Route
              path="/workout"
              element={
                <WorkoutPage
                  user={user}
                  workouts={workouts}
                  activeWorkoutId={activeWorkoutId}
                  onStartWorkout={handleStartWorkout}
                  onFinishWorkout={handleFinishWorkout}
                  onCancelWorkout={handleCancelWorkout}
                  onOpenShareModal={(log) => setShareModalLog(log)}
                />
              }
            />
            <Route
              path="/workout/:workoutId"
              element={
                <WorkoutPage
                  user={user}
                  workouts={workouts}
                  activeWorkoutId={activeWorkoutId}
                  onStartWorkout={handleStartWorkout}
                  onFinishWorkout={handleFinishWorkout}
                  onCancelWorkout={handleCancelWorkout}
                  onOpenShareModal={(log) => setShareModalLog(log)}
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <AnalyticsPage
                  logs={logs}
                  user={user}
                  onOpenShareModal={(log) => setShareModalLog(log)}
                />
              }
            />
            <Route
              path="/knee"
              element={<KneeRecoveryPage />}
            />
            <Route
              path="/exercises"
              element={<KneeRecoveryPage />}
            />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  user={user}
                  logs={logs}
                  workouts={workouts}
                  onProfileUpdated={(updated) => setUser(updated)}
                  onDataReset={handleDataReset}
                />
              }
            />
          </Routes>
        </main>

        {shareModalLog && (
          <ShareCardModal
            log={shareModalLog}
            user={user}
            onClose={() => setShareModalLog(null)}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

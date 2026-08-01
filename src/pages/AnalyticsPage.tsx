import React from 'react';
import { UserProfile, WorkoutLog } from '../types';
import { AnalyticsView } from '../components/AnalyticsView';

interface AnalyticsPageProps {
  logs: WorkoutLog[];
  user: UserProfile;
}

export function AnalyticsPage({ logs, user }: AnalyticsPageProps) {
  return <AnalyticsView logs={logs} user={user} />;
}

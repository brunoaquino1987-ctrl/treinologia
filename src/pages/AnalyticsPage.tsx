import React from 'react';
import { UserProfile, WorkoutLog } from '../types';
import { AnalyticsView } from '../components/AnalyticsView';

interface AnalyticsPageProps {
  logs: WorkoutLog[];
  user: UserProfile;
  onOpenShareModal?: (log: WorkoutLog) => void;
}

export function AnalyticsPage({ logs, user, onOpenShareModal }: AnalyticsPageProps) {
  return <AnalyticsView logs={logs} user={user} onOpenShareModal={onOpenShareModal} />;
}

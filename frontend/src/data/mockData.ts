import { SessionReport, CreateSessionResponse } from '@/types/session';

export const mockSessionReport: SessionReport = {
  overall_focus_score: 67,
  focus_quality: 85,
  resilience: 21,
  successful_nudges: 14,
  estimated_time_saved_minutes: 31.5,
  productive_time_seconds: 5400, // 90 minutes
  unproductive_time_seconds: 1800, // 30 minutes
  top_distractions: [
    { type: 'Social Media', count: 15 },
    { type: 'Email Alerts', count: 10 },
    { type: 'Unplanned Interruptions', count: 7 },
    { type: 'News Browsing', count: 5 },
  ],
  productive_sites: [
    'Stack Overflow',
    'Documentation',
    'Project Management Tool',
    'Online Courses',
    'Coding Platforms',
  ],
  summary_text: "You were able to focus for the majority of the session. Although you were distracted a few times, you were able to recover quickly when notified. Keep focusing!",
};

export const mockCreateSessionResponse: CreateSessionResponse = {
  id: 'session_' + Date.now(),
  title: '',
  description: '',
  planned_duration_seconds: 0,
  started_at: new Date().toISOString(),
};

// Helper to simulate API delay
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// API Request Types
export interface CreateSessionPayload {
  title: string;
  description: string;
  planned_duration_seconds: number;
}

export interface CreateSessionResponse {
  id: string;
  title: string;
  description: string;
  planned_duration_seconds: number;
  started_at: string;
}

// API Response Types
export interface Distraction {
  type: string;
  count: number;
}

export interface SessionReport {
  overall_focus_score: number;
  focus_quality: number;
  resilience: number;
  successful_nudges: number;
  estimated_time_saved_minutes: number;
  productive_time_seconds: number;
  unproductive_time_seconds: number;
  top_distractions: Distraction[];
  productive_sites: string[];
  summary_text: string;
}

// Session State
export interface SessionState {
  id: string;
  title: string;
  description: string;
  planned_duration_seconds: number;
  remaining_seconds: number;
  status: 'idle' | 'active' | 'paused' | 'completed';
}

// Duration input type
export interface DurationInput {
  hours: number;
  minutes: number;
  seconds: number;
}

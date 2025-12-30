import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StopCircle, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionState {
  sessionId: string;
  title: string;
  description: string;
  durationSeconds: number;
}

const ActiveSession: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionState = location.state as SessionState | null;
  const apiBaseUrl = import.meta.env.NEXT_PUBLIC_API_BASE_URL;
  const metricsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(0);
  const [remainingSeconds, setRemainingSeconds] = useState(
    sessionState?.durationSeconds || 0
  );
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    if (!sessionState) {
      navigate('/');
      return;
    }
  }, [sessionState, navigate]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    remainingRef.current = remainingSeconds;
  }, [remainingSeconds]);

  const sendSessionMetrics = useCallback(async () => {
    if (!sessionState || !apiBaseUrl) {
      if (!apiBaseUrl) {
        console.error('NEXT_PUBLIC_API_BASE_URL is not configured');
      }
      return;
    }

    const elapsedSeconds = Math.max(
      sessionState.durationSeconds - remainingRef.current,
      0
    );
    const avgFocusScore = Math.min(
      Math.round((elapsedSeconds / Math.max(sessionState.durationSeconds, 1)) * 100),
      100
    );

    const payload = {
      session_id: sessionState.sessionId,
      avg_focus_score: avgFocusScore,
      productive_seconds: elapsedSeconds,
      unproductive_seconds: 0,
      distractions: [],
    };

    try {
      await fetch(`${apiBaseUrl}/session/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error sending session metrics:', error);
    }
  }, [apiBaseUrl, sessionState]);

  useEffect(() => {
    if (!sessionState) return;

    metricsIntervalRef.current = setInterval(() => {
      sendSessionMetrics();
    }, 30000);

    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
        metricsIntervalRef.current = null;
      }
    };
  }, [sendSessionMetrics, sessionState]);

  useEffect(() => {
    if (remainingSeconds <= 0 && metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
  }, [remainingSeconds]);

  const handleEndSession = useCallback(async () => {
    if (isEnding) return;
    setIsEnding(true);

    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }

    await sendSessionMetrics();

    navigate('/report', {
      state: { sessionId: sessionState?.sessionId },
    });
  }, [isEnding, navigate, sendSessionMetrics, sessionState?.sessionId]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleEndSession, remainingSeconds]);

  if (!sessionState) {
    return null;
  }

  const progress = sessionState.durationSeconds > 0
    ? ((sessionState.durationSeconds - remainingSeconds) / sessionState.durationSeconds) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-primary/10 animate-breathe" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/15 animate-breathe" style={{ animationDelay: '1s' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-primary/20 animate-breathe" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 text-center animate-fade-in">
        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          <span className="text-muted-foreground font-medium flex items-center gap-2">
            <Focus className="w-4 h-4" />
            Focusing...
          </span>
        </div>

        {/* Session title */}
        <h1 className="font-display text-2xl font-semibold text-foreground mb-12">
          {sessionState.title}
        </h1>

        {/* Timer display */}
        <div className="relative mb-12">
          <div className="timer-display text-foreground">
            {formatTime(remainingSeconds)}
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 w-64 mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* End session button */}
        <Button
          variant="destructive"
          size="lg"
          onClick={handleEndSession}
          disabled={isEnding}
          className="px-8"
        >
          <StopCircle className="w-5 h-5 mr-2" />
          {isEnding ? 'Ending Session...' : 'End Session'}
        </Button>
      </div>
    </div>
  );
};

export default ActiveSession;

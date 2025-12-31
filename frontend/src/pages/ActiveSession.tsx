import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StopCircle, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandBar } from '@/components/BrandBar';

interface SessionState {
  sessionId: string;
  title: string;
  description: string;
  durationSeconds: number;
}

const focusThreshold = 60;

const ActiveSession: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionState = location.state as SessionState | null;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const metricsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(0);
  const [remainingSeconds, setRemainingSeconds] = useState(sessionState?.durationSeconds || 0);
  const [isEnding, setIsEnding] = useState(false);
  const [isVisible, setIsVisible] = useState(document.visibilityState === 'visible');
  const [isFocused, setIsFocused] = useState(typeof document.hasFocus === 'function' ? document.hasFocus() : true);
  const lastTickRef = useRef<number>(Date.now());
  const productiveSecondsRef = useRef(0);
  const unproductiveSecondsRef = useRef(0);
  const focusScoreSumRef = useRef(0);
  const focusSampleCountRef = useRef(0);
  const awayStartedAtRef = useRef<number | null>(null);
  const distractionsRef = useRef<Record<string, number>>({
    tab_switch: 0,
    long_absence: 0,
  });

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

  const currentFocusScore = useCallback(() => {
    if (!isVisible || !isFocused) return 0;
    return 100;
  }, [isFocused, isVisible]);

  const registerAwayReturn = useCallback(() => {
    if (awayStartedAtRef.current === null) return;
    const awayMs = Date.now() - awayStartedAtRef.current;
    awayStartedAtRef.current = null;
    if (awayMs < 5000) return;
    if (awayMs <= 30000) {
      distractionsRef.current.tab_switch += 1;
    } else {
      distractionsRef.current.long_absence += 1;
    }
  }, []);

  const sendSessionMetrics = useCallback(async () => {
    if (!sessionState || !apiBaseUrl) {
      if (!apiBaseUrl) {
        console.error('VITE_API_BASE_URL is not configured');
      }
      return;
    }

    const avgFocusScore =
      focusSampleCountRef.current === 0
        ? currentFocusScore()
        : Math.round(focusScoreSumRef.current / focusSampleCountRef.current);

    const payload = {
      session_id: sessionState.sessionId,
      avg_focus_score: avgFocusScore,
      productive_seconds: Math.floor(productiveSecondsRef.current),
      unproductive_seconds: Math.floor(unproductiveSecondsRef.current),
      distractions: Object.entries(distractionsRef.current)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => ({ type, count })),
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
  }, [apiBaseUrl, currentFocusScore, sessionState]);

  useEffect(() => {
    lastTickRef.current = Date.now();
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const deltaSeconds = Math.max((now - lastTickRef.current) / 1000, 0);
      lastTickRef.current = now;

      const score = currentFocusScore();
      focusScoreSumRef.current += score * deltaSeconds;
      focusSampleCountRef.current += deltaSeconds;

      if (score >= focusThreshold) {
        productiveSecondsRef.current += deltaSeconds;
      } else {
        unproductiveSecondsRef.current += deltaSeconds;
      }
    };

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [currentFocusScore]);

  useEffect(() => {
    const handleVisibility = () => {
      const visible = document.visibilityState === 'visible';
      if (!visible && awayStartedAtRef.current === null) {
        awayStartedAtRef.current = Date.now();
      }
      if (visible) {
        registerAwayReturn();
      }
      setIsVisible(visible);
    };

    const handleBlur = () => {
      if (awayStartedAtRef.current === null) {
        awayStartedAtRef.current = Date.now();
      }
      setIsFocused(false);
    };

    const handleFocus = () => {
      registerAwayReturn();
      setIsFocused(true);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [registerAwayReturn]);

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

    if (sessionState && apiBaseUrl) {
      try {
        const response = await fetch(`${apiBaseUrl}/session/end`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionState.sessionId }),
        });

        if (!response.ok) {
          console.error('Failed to end session', response.statusText);
        }
      } catch (error) {
        console.error('Error ending session:', error);
      }
    } else if (!apiBaseUrl) {
      console.error('VITE_API_BASE_URL is not configured');
    }

    navigate('/report', {
      state: { sessionId: sessionState?.sessionId },
    });
  }, [apiBaseUrl, isEnding, navigate, sendSessionMetrics, sessionState]);

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
      <BrandBar />
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,46,58,0.38) 0%, rgba(25,51,63,0.28) 35%, rgba(78,58,38,0.18) 100%), url('/autumn-bg.jpg')",
          backgroundColor: 'hsl(var(--background))',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/10 to-amber-900/10 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center gap-8 animate-fade-in">
        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/15 backdrop-blur-md text-white/90">
          <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          <span className="font-medium flex items-center gap-2">
            <Focus className="w-4 h-4" />
            Focusing...
          </span>
        </div>

        {/* Session title */}
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-white drop-shadow-lg max-w-3xl">
          {sessionState.title}
        </h1>

        {/* Timer display */}
        <div className="flex flex-col items-center gap-6">
          <div className="timer-display text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)] text-7xl md:text-8xl">
            {formatTime(remainingSeconds)}
          </div>
          <div className="mt-2 w-full md:w-96 mx-auto h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/15">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* End session button */}
        <Button
          variant="secondary"
          size="lg"
          onClick={handleEndSession}
          disabled={isEnding}
          className="px-8 bg-white text-slate-900 hover:bg-white/90 border border-white/40 shadow-xl rounded-full"
        >
          <StopCircle className="w-5 h-5 mr-2" />
          {isEnding ? 'Ending Session...' : 'End Session'}
        </Button>
      </div>
    </div>
  );
};

export default ActiveSession;

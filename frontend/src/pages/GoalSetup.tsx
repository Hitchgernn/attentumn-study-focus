import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DurationPicker } from '@/components/DurationPicker';
import { DurationInput, CreateSessionPayload, CreateSessionResponse } from '@/types/session';
import { useToast } from '@/hooks/use-toast';
import { BrandBar } from '@/components/BrandBar';

const GoalSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<DurationInput>({
    hours: 2,
    minutes: 15,
    seconds: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const durationToSeconds = (d: DurationInput): number => {
    return d.hours * 3600 + d.minutes * 60 + d.seconds;
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const handleStartSession = async () => {
    if (!title.trim()) {
      toast({
        title: 'Please enter a goal title',
        variant: 'destructive',
      });
      return;
    }

    const totalSeconds = durationToSeconds(duration);
    if (totalSeconds < 60) {
      toast({
        title: 'Duration must be at least 1 minute',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const payload: CreateSessionPayload = {
      title: title.trim(),
      description: description.trim() || null,
      planned_duration_seconds: totalSeconds,
    };

    if (!apiBaseUrl) {
      console.error('VITE_API_BASE_URL is not configured');
      toast({
        title: 'API is not configured',
        description: 'Set VITE_API_BASE_URL in .env.local (e.g., http://localhost:4000).',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Failed to create session', response.statusText);
        throw new Error('Request failed');
      }

      const data: CreateSessionResponse = await response.json();

      if (!data.session_id) {
        console.error('No session_id returned from create session');
        throw new Error('Missing session_id');
      }

      navigate('/session', {
        state: {
          sessionId: data.session_id,
          title: payload.title,
          description: payload.description || '',
          durationSeconds: payload.planned_duration_seconds,
        },
      });
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Unable to start session',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
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
      <div className="w-full max-w-lg animate-fade-in relative z-10">
        <div className="bg-card/20 border border-slate-900/30 rounded-3xl shadow-2xl p-8 backdrop-blur-md">
          <div className="text-center mb-10 space-y-4">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 shadow-sm border border-amber-200">
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-medium">Autumn focus mode</span>
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Hi Annee, what's your goal today?
            </h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-md font-medium">
                Title
              </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete React project"
              className="h-12 bg-white/30 border-slate-900/25 text-black placeholder:text-slate-500 shadow-sm  focus-visible:border-slate-900/20 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-md font-medium">
                Description
              </Label>
              <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="min-h-[100px] resize-none bg-white/25 border-slate-900/30 text-black placeholder:text-slate-500 shadow-sm focus-visible:border-slate-900/20 focus-visible:ring-offset-0"
            />
          </div>

            <div className="pt-4">
              <DurationPicker value={duration} onChange={setDuration} />
            </div>

            <div className="pt-6">
              <Button
                variant="focus"
                size="xl"
                className="w-full"
                onClick={handleStartSession}
                disabled={isLoading}
              >
                <Timer className="w-5 h-5" />
                {isLoading ? 'Starting...' : 'Start Focus Session'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSetup;

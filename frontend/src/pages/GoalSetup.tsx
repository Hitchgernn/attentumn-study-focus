import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DurationPicker } from '@/components/DurationPicker';
import { DurationInput, CreateSessionPayload, CreateSessionResponse } from '@/types/session';
import { useToast } from '@/hooks/use-toast';

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

    const apiBaseUrl = import.meta.env.NEXT_PUBLIC_API_BASE_URL;
    const payload: CreateSessionPayload = {
      title: title.trim(),
      description: description.trim() || null,
      planned_duration_seconds: totalSeconds,
    };

    if (!apiBaseUrl) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not configured');
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Hi <span className="text-primary">Chris</span>, what's your goal today?
          </h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete React project"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="min-h-[100px] resize-none"
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
  );
};

export default GoalSetup;

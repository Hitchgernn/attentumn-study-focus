import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DurationPicker } from '@/components/DurationPicker';
import { DurationInput, CreateSessionPayload } from '@/types/session';
import { mockCreateSessionResponse, simulateApiDelay } from '@/data/mockData';
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

    // Simulate API call: POST /session/create
    const payload: CreateSessionPayload = {
      title: title.trim(),
      description: description.trim(),
      planned_duration_seconds: totalSeconds,
    };

    console.log('Creating session with payload:', payload);

    await simulateApiDelay(500);

    const response = {
      ...mockCreateSessionResponse,
      ...payload,
      id: 'session_' + Date.now(),
    };

    console.log('Session created:', response);

    // Navigate to active session with session data
    navigate('/session', {
      state: {
        sessionId: response.id,
        title: response.title,
        description: response.description,
        durationSeconds: response.planned_duration_seconds,
      },
    });
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

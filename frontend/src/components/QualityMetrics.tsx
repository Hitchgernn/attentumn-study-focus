import React from 'react';

interface QualityMetricsProps {
  focusQuality: number;
  resilience: number;
}

export const QualityMetrics: React.FC<QualityMetricsProps> = ({
  focusQuality,
  resilience,
}) => {
  const getBarColor = (value: number) => {
    if (value >= 70) return 'bg-success';
    if (value >= 40) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="relative w-12 h-24 bg-muted rounded-lg overflow-hidden">
          <div
            className={`absolute bottom-0 w-full ${getBarColor(focusQuality)} transition-all duration-1000`}
            style={{ height: `${focusQuality}%` }}
          />
        </div>
        <span className="text-2xl font-display font-bold mt-2">{focusQuality}</span>
        <span className="text-xs text-muted-foreground">Focus<br/>Quality</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-12 h-24 bg-muted rounded-lg overflow-hidden">
          <div
            className={`absolute bottom-0 w-full ${getBarColor(resilience)} transition-all duration-1000`}
            style={{ height: `${resilience}%` }}
          />
        </div>
        <span className="text-2xl font-display font-bold mt-2">{resilience}</span>
        <span className="text-xs text-muted-foreground">Resilience</span>
      </div>
    </div>
  );
};

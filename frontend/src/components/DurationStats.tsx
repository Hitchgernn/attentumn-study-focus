import React from 'react';

interface DurationStatsProps {
  totalMinutes: number;
  avgMinutes: number;
  maxMinutes: number;
}

export const DurationStats: React.FC<DurationStatsProps> = ({
  totalMinutes,
  avgMinutes,
  maxMinutes,
}) => {
  return (
    <div className="focus-card space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total Duration</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-display font-bold">{totalMinutes}</span>
          <span className="text-sm text-muted-foreground">min</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Avg Duration</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-display font-bold">{avgMinutes}</span>
          <span className="text-sm text-muted-foreground">min</span>
          <span className="text-xs text-success ml-1">↑ 20%</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Max Duration</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-display font-bold">{maxMinutes}</span>
          <span className="text-sm text-muted-foreground">min</span>
          <span className="text-xs text-success ml-1">↑ 15%</span>
        </div>
      </div>
    </div>
  );
};

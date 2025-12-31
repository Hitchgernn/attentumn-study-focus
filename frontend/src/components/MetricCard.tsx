import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'default' | 'success' | 'warning';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  variant = 'default',
}) => {
  const bgColors = {
    default: 'bg-white/50',
    success: 'bg-white/50',
    warning: 'bg-white/50',
  };

  const iconColors = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
  };

  return (
    <div className={`metric-card ${bgColors[variant]} min-h-[120px] border border-white/45 shadow-md backdrop-blur-sm`}>
      <div className={`rounded-full p-2 mb-2 ${iconColors[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-3xl font-display font-bold text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
};

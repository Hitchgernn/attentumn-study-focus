import React from 'react';
import { Distraction } from '@/types/session';
import { MessageSquare, Mail, AlertCircle, Newspaper } from 'lucide-react';

interface DistractionListProps {
  distractions: Distraction[];
}

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'social media':
      return MessageSquare;
    case 'email alerts':
      return Mail;
    case 'unplanned interruptions':
      return AlertCircle;
    case 'news browsing':
      return Newspaper;
    default:
      return AlertCircle;
  }
};

export const DistractionList: React.FC<DistractionListProps> = ({ distractions }) => {
  return (
    <div className="focus-card">
      <h3 className="font-display font-semibold text-lg mb-4">Top Distractions</h3>
      <div className="space-y-3">
        {distractions.map((distraction, index) => {
          const Icon = getIcon(distraction.type);
          return (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-destructive/10 rounded-lg">
                  <Icon className="w-4 h-4 text-destructive" />
                </div>
                <span className="text-sm font-medium">{distraction.type}</span>
              </div>
              <span className="text-sm text-muted-foreground">{distraction.count} counts</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Review these to optimize your focus environment and minimize future interruptions.
      </p>
    </div>
  );
};

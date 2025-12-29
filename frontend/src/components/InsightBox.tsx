import React from 'react';
import { Quote } from 'lucide-react';

interface InsightBoxProps {
  text: string;
}

export const InsightBox: React.FC<InsightBoxProps> = ({ text }) => {
  return (
    <div className="insight-box relative">
      <Quote className="absolute -top-2 -left-2 w-6 h-6 text-warning opacity-60" />
      <p className="text-base leading-relaxed italic pl-4">
        "{text}"
      </p>
    </div>
  );
};

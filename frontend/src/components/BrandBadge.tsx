import React from 'react';
import clsx from 'clsx';

interface BrandBadgeProps {
  className?: string;
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({ className }) => {
  return (
    <div className={clsx('flex items-center gap-3 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]', className)}>
      <img
        src="/logo.png"
        alt="Attentum logo"
        className="w-10 h-10 object-cover drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]"
      />
      <div className="leading-tight">
        <div className="flex items-center gap-1 text-[22px] font-display font-semibold tracking-tight">
          <span className="text-slate-100">Attentumn</span>
        </div>
        <span className="text-[11px] uppercase tracking-[0.22em] text-slate-100/80">Study Focus</span>
      </div>
    </div>
  );
};

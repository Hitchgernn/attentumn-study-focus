import React, { useState, useRef } from 'react';
import { DurationInput } from '@/types/session';

interface DurationPickerProps {
  value: DurationInput;
  onChange: (duration: DurationInput) => void;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({ value, onChange }) => {
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof DurationInput, inputValue: string) => {
    const numValue = parseInt(inputValue) || 0;
    let clampedValue = numValue;

    if (field === 'hours') {
      clampedValue = Math.min(Math.max(numValue, 0), 23);
    } else {
      clampedValue = Math.min(Math.max(numValue, 0), 59);
    }

    onChange({ ...value, [field]: clampedValue });
  };

  const formatValue = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof DurationInput,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const max = field === 'hours' ? 23 : 59;
      const newValue = Math.min(value[field] + 1, max);
      onChange({ ...value, [field]: newValue });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(value[field] - 1, 0);
      onChange({ ...value, [field]: newValue });
    } else if (e.key === ':' || e.key === 'Tab') {
      if (e.key === ':') {
        e.preventDefault();
      }
      nextRef?.current?.focus();
      nextRef?.current?.select();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1 text-muted-foreground text-sm">
        <span className="w-20 text-center">Hours</span>
        <span className="w-4"></span>
        <span className="w-20 text-center">Minutes</span>
        <span className="w-4"></span>
        <span className="w-20 text-center">Seconds</span>
      </div>
      <div className="flex items-center">
        <input
          ref={hoursRef}
          type="text"
          inputMode="numeric"
          value={formatValue(value.hours)}
          onChange={(e) => handleChange('hours', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'hours', minutesRef)}
          onFocus={(e) => e.target.select()}
          className="duration-input text-foreground focus:text-primary"
          maxLength={2}
        />
        <span className="text-4xl font-light text-muted-foreground mx-1">:</span>
        <input
          ref={minutesRef}
          type="text"
          inputMode="numeric"
          value={formatValue(value.minutes)}
          onChange={(e) => handleChange('minutes', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'minutes', secondsRef)}
          onFocus={(e) => e.target.select()}
          className="duration-input text-foreground focus:text-primary"
          maxLength={2}
        />
        <span className="text-4xl font-light text-muted-foreground mx-1">:</span>
        <input
          ref={secondsRef}
          type="text"
          inputMode="numeric"
          value={formatValue(value.seconds)}
          onChange={(e) => handleChange('seconds', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'seconds')}
          onFocus={(e) => e.target.select()}
          className="duration-input text-foreground focus:text-primary"
          maxLength={2}
        />
      </div>
    </div>
  );
};

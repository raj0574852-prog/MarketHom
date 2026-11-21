'use client';

import React from 'react';

interface PublisherMetricGaugeProps {
  label: string;
  value: number | null | undefined;
  max?: number;
  type?: 'score' | 'percentage';
  size?: 'small' | 'large';
  colorClass?: string;
}

export function PublisherMetricGauge({
  label,
  value,
  max = 100,
  type = 'score',
  size = 'small',
  colorClass = 'text-cyan-400',
}: PublisherMetricGaugeProps) {
  const radius = size === 'large' ? 44 : 20;
  const stroke = size === 'large' ? 7 : 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const displayPercentage = typeof value === 'number' ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  const isLarge = size === 'large';
  const viewBoxSize = radius * 2;

  if (value === null || value === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <span className="text-2xl font-bold text-slate-500">N/A</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: viewBoxSize, height: viewBoxSize }}>
        {/* Background Circle */}
        <svg
          height={viewBoxSize}
          width={viewBoxSize}
          className="transform -rotate-90 drop-shadow-md"
        >
          <circle
            stroke="rgba(255, 255, 255, 0.1)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle with glow */}
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${isLarge ? 'text-2xl font-black text-white' : 'text-xs font-bold text-white'} tracking-tight`}>
            {value}{type === 'percentage' ? '%' : ''}
          </span>
          {isLarge && (
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              / {max}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

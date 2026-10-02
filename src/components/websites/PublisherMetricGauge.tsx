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
  colorClass = 'text-blue-600',
}: PublisherMetricGaugeProps) {
  const radius = size === 'large' ? 40 : 18;
  const stroke = size === 'large' ? 8 : 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const displayPercentage = typeof value === 'number' ? (value / max) * 100 : 0;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  const isLarge = size === 'large';
  const viewBoxSize = radius * 2;

  if (value === null || value === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <span className="text-2xl font-bold text-slate-300">N/A</span>
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
          className="transform -rotate-90"
        >
          <circle
            stroke="#E2E8F0"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle (Static) */}
          <circle
            className={`${colorClass}`}
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex items-center justify-center">
          <span className={`${isLarge ? 'text-3xl' : 'text-lg'} font-bold text-slate-900`}>
            {value}{type === 'percentage' ? '%' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number | null | undefined;
  duration?: number;
  children: (currentValue: number | null | undefined) => React.ReactNode;
}

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

export function AnimatedCounter({ value, duration = 1500, children }: AnimatedCounterProps) {
  const [currentValue, setCurrentValue] = useState<number | null | undefined>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (value === null || value === undefined) {
      setCurrentValue(value);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrentValue(value);
      animatedRef.current = true;
      return;
    }

    // Set initial value to 0 if we haven't animated
    if (!animatedRef.current) {
      setCurrentValue(0);
    } else {
      // If we already animated and value changes, just jump to new value
      setCurrentValue(value);
      return;
    }

    let animationFrameId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          
          let startTimestamp: number | null = null;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = easeOutQuart(progress);
            
            setCurrentValue(Math.round(easeProgress * value));
            
            if (progress < 1) {
              animationFrameId = requestAnimationFrame(step);
            } else {
              setCurrentValue(value);
            }
          };
          animationFrameId = requestAnimationFrame(step);
          
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  return <div ref={elementRef} className="h-full w-full">{children(currentValue)}</div>;
}

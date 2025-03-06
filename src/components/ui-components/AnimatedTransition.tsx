
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide-up' | 'slide-down';
  duration?: number;
  delay?: number;
}

export function AnimatedTransition({
  children,
  className,
  animationType = 'fade',
  duration = 300,
  delay = 0,
}: AnimatedTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animationClasses = {
    fade: 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
  };

  return (
    <div
      className={cn(
        'transition-all',
        isVisible ? animationClasses[animationType] : 'opacity-0',
        className
      )}
      style={{ 
        animationDuration: `${duration}ms`,
        animationFillMode: 'forwards',
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

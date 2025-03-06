
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  blurStrength?: 'light' | 'medium' | 'strong';
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className,
  blurStrength = 'medium',
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  const blurValues = {
    light: 'backdrop-blur-md bg-white/10',
    medium: 'backdrop-blur-xl bg-white/20',
    strong: 'backdrop-blur-2xl bg-white/30',
  };
  
  return (
    <div
      className={cn(
        'rounded-xl border border-white/20 shadow-md',
        blurValues[blurStrength],
        hoverEffect && 'transition-all duration-300 hover:shadow-lg hover:border-white/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

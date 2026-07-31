import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div
      className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm transition-all duration-150 ${
        hoverEffect ? 'hover:border-zinc-400 dark:hover:border-zinc-700' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

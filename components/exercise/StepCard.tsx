'use client';

import { ReactNode } from 'react';
import { CircleCheck as CheckCircle, Circle } from 'lucide-react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  children?: ReactNode;
}

export default function StepCard({
  stepNumber,
  title,
  description,
  isActive,
  isCompleted,
  children,
}: StepCardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl border transition-all duration-300
        ${isActive
          ? 'border-gold/50 shadow-lg shadow-gold/10'
          : isCompleted
            ? 'border-success/30 opacity-100'
            : 'border-border opacity-50'}
      `}
    >
      {/* Card header */}
      <div className="flex items-start gap-4 p-5 border-b border-border">
        <div
          className={`
            w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
            ${isCompleted
              ? 'bg-success text-white'
              : isActive
                ? 'bg-gold text-white'
                : 'bg-slate-100 border border-border text-muted-foreground'}
          `}
          style={{ fontFamily: 'var(--font-spartan)' }}
        >
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : stepNumber}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-bold text-base mb-0.5"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            {description}
          </p>
        </div>

        {isCompleted && (
          <span className="flex-shrink-0 bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-full border border-success/20"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Done
          </span>
        )}
        {!isCompleted && !isActive && (
          <Circle className="w-4 h-4 text-muted-foreground/30 flex-shrink-0 mt-1" />
        )}
      </div>

      {/* Card body — only visible when active */}
      {isActive && children && (
        <div className="p-5 space-y-5 animate-fade-in">
          {children}
        </div>
      )}

      {/* Completed summary */}
      {isCompleted && (
        <div className="px-5 py-3 animate-fade-in">
          <p className="text-success/70 text-xs font-medium"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            This step has been completed correctly.
          </p>
        </div>
      )}
    </div>
  );
}

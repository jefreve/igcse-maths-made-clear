'use client';

import { CircleCheck as CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function ProgressBar({ currentStep, totalSteps, stepTitles }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Step labels */}
      <div className="flex items-center justify-between mb-3">
        {stepTitles.map((title, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${isCompleted
                    ? 'bg-gold text-white shadow-sm'
                    : isActive
                      ? 'bg-gold text-white ring-4 ring-gold/20 shadow-md'
                      : 'bg-slate-100 border border-border text-muted-foreground/40'}
                `}
                style={{ fontFamily: 'var(--font-spartan)' }}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`text-xs text-center leading-tight hidden sm:block ${
                  isActive ? 'text-gold-dark font-bold' : isCompleted ? 'text-muted-foreground font-medium' : 'text-muted-foreground/30'
                }`}
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress track */}
      <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden border border-border/10">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(255,195,0,0.4)]"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="flex justify-end mt-2">
        <span className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
}

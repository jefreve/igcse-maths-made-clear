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
        rounded-[2.5rem] border transition-all duration-500
        ${isActive
          ? 'bg-white border-slate-200 shadow-2xl shadow-slate-200/60 scale-[1.01]'
          : isCompleted
            ? 'bg-white/60 border-slate-100 opacity-100 shadow-sm'
            : 'bg-slate-50/50 border-transparent opacity-60'}
      `}
    >
      {/* Card header */}
      <div className={`flex items-start gap-6 p-8 ${isActive ? 'border-b border-slate-50' : ''}`}>
        <div
          className={`
            w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg
            transition-all duration-500
            ${isCompleted
              ? 'bg-success text-white rotate-[360deg]'
              : isActive
                ? 'bg-navy-dark text-white shadow-xl shadow-navy-dark/20 scale-110'
                : 'bg-white border border-slate-200 text-slate-300'}
          `}
          style={{ fontFamily: 'var(--font-spartan)' }}
        >
          {isCompleted ? <CheckCircle className="w-6 h-6" /> : stepNumber}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h3 className={`font-bold text-xl mb-1 transition-colors duration-300 ${isActive ? 'text-navy-dark' : 'text-slate-400'}`}
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            {title}
          </h3>
          <p className={`text-base leading-relaxed transition-colors duration-300 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            {description}
          </p>
        </div>

        {isCompleted && (
          <span className="flex-shrink-0 bg-success/10 text-success text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-success/10"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Complete
          </span>
        )}
        {!isCompleted && !isActive && (
          <Circle className="w-5 h-5 text-slate-200 flex-shrink-0 mt-2" />
        )}
      </div>

      {/* Card body — only visible when active */}
      {isActive && children && (
        <div className="p-8 pt-4 space-y-8 animate-fade-in bg-white rounded-b-[2.5rem]">
          {children}
        </div>
      )}

      {/* Completed summary */}
      {isCompleted && (
        <div className="px-8 py-5 animate-fade-in border-t border-slate-50 bg-slate-50/20 rounded-b-[2.5rem]">
          <p className="text-success/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Great progress! Step verified.
          </p>
        </div>
      )}
    </div>
  );
}

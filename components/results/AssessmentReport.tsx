'use client';

import { InlineMath } from 'react-katex';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, Clock, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import type { StepAttempt } from '@/lib/types';

interface ReportProps {
  steps: StepAttempt[];
  sessionDuration: number;
}

const STEP_TITLES = [
  'Identify Domain Conditions',
  'Solve the Quadratic Inequality',
  'Write the Final Domain',
];

const STEP_DIMENSIONS = [
  {
    reasoning: 'Correctly identified both the denominator and square root conditions, combining them to x² − 8x + 15 > 0.',
    algebra: 'Recognised that the square root in the denominator requires strictly > 0, not ≥ 0.',
    notation: 'Expressed the combined condition in correct mathematical notation.',
  },
  {
    reasoning: 'Identified critical values x = 3 and x = 5 by solving x² − 8x + 15 = 0.',
    algebra: 'Correctly solved via factorisation or the quadratic formula and applied sign analysis.',
    notation: 'Expressed the solution as x < 3 or x > 5 rather than listing just the roots.',
  },
  {
    reasoning: 'Understood that the critical values must be excluded as open endpoints.',
    algebra: 'Correctly united the two intervals.',
    notation: 'Used correct interval notation: (−∞, 3) ∪ (5, +∞).',
  },
];

type DimScore = 'correct' | 'guided' | 'revealed';

function getDimScore(step: StepAttempt): DimScore {
  if (step.status === 'revealed') return 'revealed';
  if (step.hintsUsed > 0 || step.feedbackReceived) return 'guided';
  return 'correct';
}

function ScoreBadge({ score }: { score: DimScore }) {
  const config = {
    correct: { icon: CheckCircle, colour: 'text-success', bg: 'bg-success/5 border-success/10', label: 'Perfect' },
    guided: { icon: AlertCircle, colour: 'text-gold-dark', bg: 'bg-gold/5 border-gold/10', label: 'Guided' },
    revealed: { icon: XCircle, colour: 'text-error', bg: 'bg-error/5 border-error/10', label: 'Review Needed' },
  }[score];

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${config.bg} ${config.colour}`}
      style={{ fontFamily: 'var(--font-montserrat)' }}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function formatDuration(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${remainingSecs}s`;
}

export default function AssessmentReport({ steps, sessionDuration }: ReportProps) {
  const overallScore = steps.reduce((acc, step) => {
    const score = getDimScore(step);
    return acc + (score === 'correct' ? 3 : score === 'guided' ? 2 : 1);
  }, 0);
  const maxScore = steps.length * 3;
  const percentage = Math.round((overallScore / maxScore) * 100);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Summary header */}
      <div className="bg-white border-4 border-slate-50 rounded-[3rem] p-12 text-center shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-navy-dark via-gold to-navy-dark opacity-10" />
        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-6 py-2 mb-8">
          <span className="text-slate-400 text-[11px] font-black tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Session Overview
          </span>
        </div>
        <div className="text-8xl font-black text-navy-dark mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-spartan)' }}>
          {percentage}<span className="text-gold">%</span>
        </div>
        <p className="text-slate-400 font-bold text-lg mb-8" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Score: {overallScore} / {maxScore}
        </p>

        <div className="flex items-center justify-center gap-4 text-slate-300 text-xs font-bold uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          <Clock className="w-4 h-4 text-gold" />
          Completed in {formatDuration(sessionDuration)}
        </div>
      </div>

      {/* Per-step breakdown */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-navy-dark font-black text-3xl tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Step Details
          </h2>
          <div className="w-12 h-1 bg-gold/30 rounded-full" />
        </div>

        {steps.map((step, idx) => {
          const dimScore = getDimScore(step);
          const dims = STEP_DIMENSIONS[idx];

          return (
            <div key={idx} className="bg-white border-2 border-slate-50 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-100/50">
              <div className="flex items-center gap-6 px-10 py-8 border-b border-slate-50 bg-slate-50/20">
                <div className="w-12 h-12 rounded-2xl bg-navy-dark text-white font-black text-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ fontFamily: 'var(--font-spartan)' }}>
                  {idx + 1}
                </div>
                <h3 className="text-navy-dark font-black text-lg flex-1"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>
                  {STEP_TITLES[idx]}
                </h3>
                <ScoreBadge score={dimScore} />
              </div>

              <div className="p-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {(['reasoning', 'algebra', 'notation'] as const).map((dim) => (
                  <div key={dim} className="bg-slate-50/40 border border-slate-100 rounded-[2rem] p-8 transition-transform hover:scale-[1.02]">
                    <p className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase mb-5"
                      style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {dim}
                    </p>
                    <p className="text-navy-dark font-bold text-sm leading-relaxed mb-6 min-h-[4em]"
                      style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {dims[dim]}
                    </p>
                    <div className="pt-5 border-t border-slate-100">
                      <ScoreBadge score={dimScore} />
                    </div>
                  </div>
                ))}
              </div>

              {step.answer && (
                <div className="px-10 pb-10">
                  <div className="bg-[#f0f7ff]/50 border-2 border-blue-50 rounded-[1.5rem] p-6">
                    <p className="text-blue-900/30 text-[10px] font-black uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-montserrat)' }}>
                      Your Answer
                    </p>
                    <p className="text-navy-dark font-bold text-base italic">
                      &ldquo;{step.answer}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10">
        <Link
          href="/exercise"
          className="group inline-flex items-center justify-center gap-4 border-4 border-gold text-gold-dark hover:bg-gold hover:text-white px-12 py-5 rounded-[2rem] font-black text-base transition-all duration-300 shadow-xl shadow-gold/10"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          Retake Quiz
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-4 bg-navy-dark hover:bg-navy text-white px-12 py-5 rounded-[2rem] font-black text-base transition-all shadow-2xl shadow-navy-dark/30 hover:-translate-y-1"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}

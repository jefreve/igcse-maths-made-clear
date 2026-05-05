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
    correct: { icon: CheckCircle, colour: 'text-success', bg: 'bg-success/10 border-success/30', label: 'Correct' },
    guided: { icon: AlertCircle, colour: 'text-gold-dark', bg: 'bg-gold/10 border-gold/30', label: 'With guidance' },
    revealed: { icon: XCircle, colour: 'text-error', bg: 'bg-error/10 border-error/30', label: 'Answer shown' },
  }[score];

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.colour}`}
      style={{ fontFamily: 'var(--font-montserrat)' }}>
      <Icon className="w-3 h-3" />
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
    <div className="space-y-8 animate-fade-in">
      {/* Summary header */}
      <div className="bg-white border border-border rounded-xl p-8 text-center shadow-md">
        <div className="inline-flex items-center gap-2 bg-slate-50 border border-border rounded-full px-4 py-1.5 mb-6">
          <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Exercise Complete
          </span>
        </div>
        <div className="text-6xl font-bold text-gold mb-2" style={{ fontFamily: 'var(--font-spartan)' }}>
          {percentage}%
        </div>
        <p className="text-muted-foreground text-sm font-semibold" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {overallScore} / {maxScore} points
        </p>

        <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground/50 text-xs font-medium"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          <Clock className="w-3.5 h-3.5" />
          Time taken: {formatDuration(sessionDuration)}
        </div>
      </div>

      {/* Correct answer */}
      <div className="bg-success/5 border border-success/20 rounded-xl p-6 shadow-sm">
        <p className="text-success text-[10px] font-bold tracking-widest uppercase mb-4"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Correct Answer
        </p>
        <div className="text-2xl flex justify-center text-navy-dark font-medium">
          <InlineMath math="(-\infty,\, 3) \cup (5,\, +\infty)" />
        </div>
        <p className="text-muted-foreground/70 text-xs text-center mt-4 italic" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Endpoints 3 and 5 are excluded because the denominator cannot equal zero.
        </p>
      </div>

      {/* Per-step breakdown */}
      <div className="space-y-6">
        <h2 className="text-foreground font-bold text-xl px-1" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Step-by-Step Breakdown
        </h2>

        {steps.map((step, idx) => {
          const dimScore = getDimScore(step);
          const dims = STEP_DIMENSIONS[idx];

          return (
            <div key={idx} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-slate-50/30">
                <div className="w-8 h-8 rounded-full bg-gold text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ fontFamily: 'var(--font-spartan)' }}>
                  {idx + 1}
                </div>
                <h3 className="text-foreground font-bold text-sm flex-1"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>
                  {STEP_TITLES[idx]}
                </h3>
                <ScoreBadge score={dimScore} />
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {(['reasoning', 'algebra', 'notation'] as const).map((dim) => (
                  <div key={dim} className="bg-slate-50 border border-border/50 rounded-lg p-5">
                    <p className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase mb-3"
                      style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {dim}
                    </p>
                    <p className="text-foreground/80 text-xs leading-relaxed font-medium mb-4"
                      style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {dims[dim]}
                    </p>
                    <div className="pt-2 border-t border-border/40">
                      <ScoreBadge score={dimScore} />
                    </div>
                  </div>
                ))}
              </div>

              {step.answer && (
                <div className="px-6 pb-6 pt-2 border-t border-border/30">
                  <p className="text-muted-foreground/40 text-[10px] font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Your answer
                  </p>
                  <p className="text-foreground/70 text-sm italic font-medium bg-slate-50 p-3 rounded-lg border border-border/50">
                    &ldquo;{step.answer}&rdquo;
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hints summary */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase mb-6"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Hints Summary
        </p>
        <div className="flex gap-12 px-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-3xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-spartan)' }}>
                {step.hintsUsed}
              </div>
              <p className="text-muted-foreground/50 text-[10px] font-bold uppercase" style={{ fontFamily: 'var(--font-montserrat)' }}>
                Step {idx + 1}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 pb-12">
        <Link
          href="/exercise"
          className="inline-flex items-center justify-center gap-2 border-2 border-gold text-gold-dark hover:bg-gold/5 px-8 py-3 rounded-lg font-bold text-sm transition-all"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-md hover:scale-105 active:scale-95"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

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
    guided: { icon: AlertCircle, colour: 'text-gold', bg: 'bg-gold/10 border-gold/30', label: 'With guidance' },
    revealed: { icon: XCircle, colour: 'text-error', bg: 'bg-error/10 border-error/30', label: 'Answer shown' },
  }[score];

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.bg} ${config.colour}`}
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
      <div className="bg-navy border border-gold/40 rounded-xl p-6 text-center">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
          <span className="text-gold text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Exercise Complete
          </span>
        </div>
        <div className="text-5xl font-bold text-gold mb-2" style={{ fontFamily: 'var(--font-spartan)' }}>
          {percentage}%
        </div>
        <p className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {overallScore} / {maxScore} points
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 text-white/40 text-xs"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          <Clock className="w-3.5 h-3.5" />
          Time taken: {formatDuration(sessionDuration)}
        </div>
      </div>

      {/* Correct answer */}
      <div className="bg-navy border border-success/30 rounded-xl p-5">
        <p className="text-success/70 text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Correct Answer
        </p>
        <div className="text-xl flex justify-center">
          <InlineMath math="(-\infty,\, 3) \cup (5,\, +\infty)" />
        </div>
        <p className="text-white/50 text-xs text-center mt-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Endpoints 3 and 5 are excluded because the denominator cannot equal zero.
        </p>
      </div>

      {/* Per-step breakdown */}
      <div className="space-y-4">
        <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Step-by-Step Breakdown
        </h2>

        {steps.map((step, idx) => {
          const dimScore = getDimScore(step);
          const dims = STEP_DIMENSIONS[idx];

          return (
            <div key={idx} className="bg-navy border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <div className="w-7 h-7 rounded-full bg-gold text-navy-dark font-bold text-sm flex items-center justify-center flex-shrink-0"
                  style={{ fontFamily: 'var(--font-spartan)' }}>
                  {idx + 1}
                </div>
                <h3 className="text-white font-semibold text-sm flex-1"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>
                  {STEP_TITLES[idx]}
                </h3>
                <ScoreBadge score={dimScore} />
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['reasoning', 'algebra', 'notation'] as const).map((dim) => (
                  <div key={dim} className="bg-navy-dark rounded-lg p-4">
                    <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-2"
                      style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {dim.charAt(0).toUpperCase() + dim.slice(1)}
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed"
                      style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {dims[dim]}
                    </p>
                    <div className="mt-3">
                      <ScoreBadge score={dimScore} />
                    </div>
                  </div>
                ))}
              </div>

              {step.answer && (
                <div className="px-5 pb-4">
                  <p className="text-white/30 text-xs mb-1" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Your answer:
                  </p>
                  <p className="text-white/60 text-sm italic" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    &ldquo;{step.answer}&rdquo;
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hints summary */}
      <div className="bg-navy border border-white/10 rounded-xl p-5">
        <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Hints Used
        </p>
        <div className="flex gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-spartan)' }}>
                {step.hintsUsed}
              </div>
              <p className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-montserrat)' }}>
                Step {idx + 1}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link
          href="/exercise"
          className="inline-flex items-center justify-center gap-2 border border-gold/40 text-gold hover:bg-gold/10 px-6 py-3 rounded-lg font-semibold text-sm transition-all"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy-dark px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

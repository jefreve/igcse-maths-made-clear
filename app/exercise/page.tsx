'use client';

import PageShell from '@/components/layout/PageShell';
import MathDisplay from '@/components/exercise/MathDisplay';
import StepController from '@/components/exercise/StepController';

export default function ExercisePage() {
  return (
    <PageShell maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Finding the Domain
          </h1>
          <p className="text-white/50 text-sm"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Work through each step carefully. You can ask for a hint at any time.
          </p>
        </div>

        {/* Function display */}
        <MathDisplay />

        {/* Step-by-step exercise */}
        <StepController />
      </div>
    </PageShell>
  );
}

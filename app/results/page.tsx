'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PageShell from '@/components/layout/PageShell';
import AssessmentReport from '@/components/results/AssessmentReport';
import Link from 'next/link';
import type { StepAttempt } from '@/lib/types';

interface ResultsData {
  steps: StepAttempt[];
  sessionDuration: number;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const raw = searchParams.get('data');

  if (!raw) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-base mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
          No results data found.
        </p>
        <Link href="/exercise"
          className="inline-flex items-center gap-2 bg-gold text-white font-bold px-6 py-3 rounded-lg text-sm hover:bg-gold-dark transition-all"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Go to Exercise
        </Link>
      </div>
    );
  }

  let data: ResultsData;
  try {
    data = JSON.parse(decodeURIComponent(raw));
  } catch {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-base mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Could not load results.
        </p>
        <Link href="/exercise"
          className="inline-flex items-center gap-2 bg-gold text-white font-bold px-6 py-3 rounded-lg text-sm hover:bg-gold-dark transition-all"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Try Again
        </Link>
      </div>
    );
  }

  return <AssessmentReport steps={data.steps} sessionDuration={data.sessionDuration} />;
}

export default function ResultsPage() {
  return (
    <PageShell maxWidth="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Your Assessment Report
        </h1>
        <p className="text-muted-foreground text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Here is a breakdown of your performance on this exercise.
        </p>
      </div>
      <Suspense fallback={
        <div className="text-center py-16 text-muted-foreground/40" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Loading results...
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </PageShell>
  );
}

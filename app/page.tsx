'use client';

import Link from 'next/link';
import { InlineMath } from 'react-katex';
import PageShell from '@/components/layout/PageShell';
import { ArrowRight, BookOpen, Brain, CircleCheck as CheckCircle, Lightbulb } from 'lucide-react';

export default function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="text-center pt-6 pb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-slate-100 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse-slow" />
          <span className="text-gold text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Self-Assessment Exercise
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Finding the Domain<br />
          <span className="text-gold">of a Function</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Work through a step-by-step guided exercise with AI-powered feedback that
          asks questions rather than giving away the answer.
        </p>

        {/* Function display */}
        <div className="inline-block bg-white border border-border rounded-xl px-8 py-6 mb-10 shadow-sm">
          <p className="text-muted-foreground text-xs mb-3 tracking-widest uppercase font-semibold"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Find the domain of
          </p>
          <div className="text-2xl sm:text-3xl text-navy-dark">
            <InlineMath math="f(x) = \dfrac{x^{2}-3}{\sqrt{x^{2}-8x+15}}" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/exercise"
            className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-white font-bold px-8 py-3.5 rounded-lg text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Begin Exercise
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-center text-muted-foreground text-xs font-bold tracking-widest uppercase mb-8"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: BookOpen,
              title: 'Step by Step',
              desc: 'Three structured steps guide you from identifying conditions to writing the final domain.',
            },
            {
              icon: Brain,
              title: 'AI Tutor',
              desc: 'Get hints and feedback that ask guiding questions — never simply giving away the answer.',
            },
            {
              icon: CheckCircle,
              title: 'Assessment Report',
              desc: 'Receive a detailed report on your reasoning, algebra, and notation at the end.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-border rounded-xl p-6 flex flex-col gap-3 hover:border-gold/40 transition-colors duration-200 shadow-sm"
            >
              <div className="w-10 h-10 bg-gold/10 border border-gold/30 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-foreground font-bold text-base" style={{ fontFamily: 'var(--font-montserrat)' }}>
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key reminder */}
      <section className="bg-slate-50 border-l-4 border-gold rounded-r-xl px-6 py-5 flex gap-4 items-start shadow-sm">
        <Lightbulb className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-foreground font-bold text-sm mb-1" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Remember
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Mistakes mean you&apos;re actually doing it. The AI tutor is here to guide you, not to judge you.
            Take your time at each step.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

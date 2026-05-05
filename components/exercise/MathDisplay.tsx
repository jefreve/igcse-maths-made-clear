'use client';

import { InlineMath } from 'react-katex';

export default function MathDisplay() {
  return (
    <div className="bg-white border border-border rounded-xl p-6 sm:p-8 text-center shadow-md">
      <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-4"
        style={{ fontFamily: 'var(--font-montserrat)' }}>
        Find the domain of
      </p>
      <div className="text-2xl sm:text-3xl flex justify-center text-navy-dark">
        <InlineMath math="f(x) = \dfrac{x^{2}-3}{\sqrt{x^{2}-8x+15}}" />
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground font-medium"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          Denominator ≠ 0
        </span>
        <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground font-medium"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          Expression under √ &gt; 0
        </span>
      </div>
    </div>
  );
}

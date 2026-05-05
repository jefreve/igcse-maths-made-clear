'use client';

import { InlineMath } from 'react-katex';

export default function MathDisplay() {
  return (
    <div className="bg-navy border border-gold/40 rounded-xl p-6 sm:p-8 text-center shadow-lg">
      <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-4"
        style={{ fontFamily: 'var(--font-montserrat)' }}>
        Find the domain of
      </p>
      <div className="text-2xl sm:text-3xl flex justify-center">
        <InlineMath math="f(x) = \dfrac{x^{2}-3}{\sqrt{x^{2}-8x+15}}" />
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 bg-navy-light border border-white/10 rounded-full px-3 py-1 text-xs text-white/60"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
          Denominator ≠ 0
        </span>
        <span className="inline-flex items-center gap-1.5 bg-navy-light border border-white/10 rounded-full px-3 py-1 text-xs text-white/60"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
          Expression under √ &gt; 0
        </span>
      </div>
    </div>
  );
}

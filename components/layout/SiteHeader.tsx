'use client';

import Image from 'next/image';

export default function SiteHeader() {
  return (
    <header className="w-full bg-navy border-b border-navy-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="IGCSE Maths Made Clear"
            width={56}
            height={56}
            className="rounded-full"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span
            className="text-gold text-xl leading-none font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-spartan)' }}
          >
            IGCSE
          </span>
          <span
            className="text-white/80 text-sm leading-tight tracking-wide"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Maths Made Clear
          </span>
        </div>
        <div className="ml-auto hidden sm:block">
          <span className="bg-gold text-navy-dark text-xs font-bold px-3 py-1 rounded-sm tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Step by Step
          </span>
        </div>
      </div>
    </header>
  );
}

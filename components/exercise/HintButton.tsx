'use client';

import { Lightbulb, Loader as Loader2 } from 'lucide-react';

interface HintButtonProps {
  onRequestHint: () => void;
  isLoading: boolean;
  hintsUsed: number;
  maxHints?: number;
  disabled?: boolean;
}

export default function HintButton({
  onRequestHint,
  isLoading,
  hintsUsed,
  maxHints = 3,
  disabled = false,
}: HintButtonProps) {
  const remaining = maxHints - hintsUsed;
  const exhausted = remaining <= 0;
  const isDisabled = disabled || exhausted || isLoading;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onRequestHint}
        disabled={isDisabled}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold
          transition-all duration-150
          ${isDisabled
            ? 'border-border text-slate-300 bg-slate-50 cursor-not-allowed'
            : 'border-gold/40 text-gold-dark bg-gold/5 hover:bg-gold/10 hover:border-gold/60 active:scale-95 cursor-pointer shadow-sm'}
        `}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Lightbulb className="w-4 h-4" />
        )}
        {isLoading ? 'Thinking...' : 'Ask for a hint'}
      </button>

      {/* Hint dots */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxHints }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              i < hintsUsed ? 'bg-gold' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {exhausted && (
        <span className="text-muted-foreground text-xs font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
          No hints remaining
        </span>
      )}
    </div>
  );
}

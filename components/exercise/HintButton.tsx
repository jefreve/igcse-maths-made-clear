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
          inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold
          transition-all duration-150
          ${isDisabled
            ? 'border-white/10 text-white/25 cursor-not-allowed'
            : 'border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60 active:scale-95 cursor-pointer'}
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
              i < hintsUsed ? 'bg-gold/60' : 'bg-white/15'
            }`}
          />
        ))}
      </div>

      {exhausted && (
        <span className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-montserrat)' }}>
          No hints remaining
        </span>
      )}
    </div>
  );
}

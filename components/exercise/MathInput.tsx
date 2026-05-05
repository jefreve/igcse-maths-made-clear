'use client';

import { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export default function MathInput({
  value,
  onChange,
  placeholder = 'Type your answer here...',
  disabled = false,
  rows = 3,
}: MathInputProps) {
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full bg-navy-dark border rounded-lg px-4 py-3 text-white text-sm resize-none
          placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-150
          ${disabled ? 'border-white/10' : 'border-white/20 hover:border-white/30 focus:border-gold/50'}
        `}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      />

      {/* Typing guide */}
      <p className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-montserrat)' }}>
        You can use: x^2 for x², sqrt() for √, &gt;= for ≥, &gt; for &gt;, ∪ for union,
        -inf/+inf for ±∞
      </p>

      {/* Live KaTeX preview */}
      {value.trim() && (
        <div className="bg-navy-dark border border-white/10 rounded-lg px-4 py-3">
          <p className="text-white/30 text-xs mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Preview
          </p>
          {previewError ? (
            <p className="text-white/40 text-sm italic">
              (Cannot render preview for this input)
            </p>
          ) : (
            <div
              className="text-white overflow-x-auto"
              onError={() => setPreviewError(true)}
            >
              <InlineMath
                math={convertToLatex(value)}
                errorColor="#ef4444"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function convertToLatex(input: string): string {
  return input
    .replace(/x\^2/g, 'x^{2}')
    .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/>=/g, '\\geq ')
    .replace(/<=/g, '\\leq ')
    .replace(/!=/g, '\\neq ')
    .replace(/≥/g, '\\geq ')
    .replace(/≤/g, '\\leq ')
    .replace(/≠/g, '\\neq ')
    .replace(/∪/g, '\\cup ')
    .replace(/∞/g, '\\infty ')
    .replace(/-inf/gi, '-\\infty')
    .replace(/\+inf/gi, '+\\infty')
    .replace(/infinity/gi, '\\infty')
    .replace(/\bor\b/g, '\\text{ or }')
    .replace(/\band\b/g, '\\text{ and }');
}

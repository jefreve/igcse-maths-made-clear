'use client';

import { useState } from 'react';
import { InlineMath } from 'react-katex';

type Sign = '+' | '-' | null;

interface SignTableProps {
  onComplete?: (result: { xLt3: Sign; between35: Sign; xGt5: Sign }) => void;
  disabled?: boolean;
}

const intervals = [
  { label: 'x < 3', key: 'xLt3' as const },
  { label: '3 < x < 5', key: 'between35' as const },
  { label: 'x > 5', key: 'xGt5' as const },
];

const factors = [
  { math: '(x - 3)', signs: ['-', '+', '+'] as Sign[] },
  { math: '(x - 5)', signs: ['-', '-', '+'] as Sign[] },
];

export default function SignTable({ onComplete, disabled = false }: SignTableProps) {
  const [productSigns, setProductSigns] = useState<{ xLt3: Sign; between35: Sign; xGt5: Sign }>({
    xLt3: null,
    between35: null,
    xGt5: null,
  });

  const toggleSign = (key: keyof typeof productSigns) => {
    if (disabled) return;
    const next: Sign = productSigns[key] === null ? '+' : productSigns[key] === '+' ? '-' : null;
    const updated = { ...productSigns, [key]: next };
    setProductSigns(updated);
    if (updated.xLt3 && updated.between35 && updated.xGt5) {
      onComplete?.(updated);
    }
  };

  const signBadge = (sign: Sign, interactive = false, key?: keyof typeof productSigns) => {
    const base = 'w-10 h-8 rounded flex items-center justify-center text-sm font-bold transition-colors duration-150';
    const colourClass = sign === '+'
      ? 'bg-success/15 text-success border border-success/30'
      : sign === '-'
        ? 'bg-error/15 text-error border border-error/30'
        : 'bg-slate-100 text-slate-400 border border-border';

    if (interactive && key) {
      return (
        <button
          onClick={() => toggleSign(key)}
          disabled={disabled}
          className={`${base} ${colourClass} ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-slate-200 cursor-pointer active:scale-95'}`}
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {sign ?? '?'}
        </button>
      );
    }

    return (
      <div className={`${base} ${colourClass}`} style={{ fontFamily: 'var(--font-montserrat)' }}>
        {sign ?? '?'}
      </div>
    );
  };

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border bg-slate-50">
        <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-montserrat)' }}>
          Sign Table — click &apos;?&apos; cells to set the product sign
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-bold"
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                Factor
              </th>
              {intervals.map((iv) => (
                <th key={iv.key} className="px-4 py-3 text-foreground font-bold text-center"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>
                  {iv.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {factors.map((factor, fi) => (
              <tr key={fi} className="border-b border-border/50">
                <td className="px-4 py-3 text-foreground font-medium">
                  <InlineMath math={factor.math} />
                </td>
                {factor.signs.map((sign, si) => (
                  <td key={si} className="px-4 py-3">
                    <div className="flex justify-center">
                      {signBadge(sign)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}

            {/* Product row — interactive */}
            <tr className="bg-gold/5 border-t border-gold/10">
              <td className="px-4 py-3 text-navy-dark font-bold">
                <InlineMath math="(x-3)(x-5)" />
              </td>
              {intervals.map((iv) => (
                <td key={iv.key} className="px-4 py-3">
                  <div className="flex justify-center">
                    {signBadge(productSigns[iv.key], true, iv.key)}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-border bg-slate-50/50">
        <p className="text-muted-foreground text-xs italic" style={{ fontFamily: 'var(--font-montserrat)' }}>
          The product is positive (+) when <InlineMath math="(x-3)(x-5) > 0" />
        </p>
      </div>
    </div>
  );
}

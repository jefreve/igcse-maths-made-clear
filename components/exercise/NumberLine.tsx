'use client';

import { useState } from 'react';

type Region = 'left' | 'middle' | 'right';

interface NumberLineProps {
  onSelectionChange?: (regions: Region[]) => void;
  disabled?: boolean;
}

export default function NumberLine({ onSelectionChange, disabled = false }: NumberLineProps) {
  const [selected, setSelected] = useState<Set<Region>>(new Set());

  const toggle = (region: Region) => {
    if (disabled) return;
    const next = new Set(selected);
    if (next.has(region)) {
      next.delete(region);
    } else {
      next.add(region);
    }
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  };

  const regionClass = (region: Region) => {
    const isSelected = selected.has(region);
    return `
      flex-1 h-3 cursor-pointer transition-all duration-200 rounded-sm
      ${disabled ? 'cursor-not-allowed' : ''}
      ${isSelected
        ? 'bg-gold hover:bg-gold-dark'
        : 'bg-slate-200 border border-border hover:bg-slate-300'}
    `;
  };

  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
      <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-4"
        style={{ fontFamily: 'var(--font-montserrat)' }}>
        Number Line — click regions to select them
      </p>

      {/* Line */}
      <div className="relative py-4">
        {/* Horizontal axis */}
        <div className="flex items-center gap-1 mb-1">
          {/* Left region */}
          <button
            onClick={() => toggle('left')}
            disabled={disabled}
            className={regionClass('left')}
            aria-label="Region x < 3"
          />

          {/* Critical point 3 */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-error border-2 border-white shadow-sm" />
          </div>

          {/* Middle region */}
          <button
            onClick={() => toggle('middle')}
            disabled={disabled}
            className={regionClass('middle')}
            aria-label="Region 3 < x < 5"
          />

          {/* Critical point 5 */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-error border-2 border-white shadow-sm" />
          </div>

          {/* Right region */}
          <button
            onClick={() => toggle('right')}
            disabled={disabled}
            className={regionClass('right')}
            aria-label="Region x > 5"
          />
        </div>

        {/* Labels */}
        <div className="flex items-center gap-1">
          <div className="flex-1 flex justify-center">
            <span className="text-muted-foreground text-xs font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
              x &lt; 3
            </span>
          </div>
          <div className="w-3 flex justify-center">
            <span className="text-error text-xs font-bold" style={{ fontFamily: 'var(--font-montserrat)' }}>
              3
            </span>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-muted-foreground text-xs font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
              3 &lt; x &lt; 5
            </span>
          </div>
          <div className="w-3 flex justify-center">
            <span className="text-error text-xs font-bold" style={{ fontFamily: 'var(--font-montserrat)' }}>
              5
            </span>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-muted-foreground text-xs font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
              x &gt; 5
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-error" />
          <span className="text-muted-foreground/60 text-xs font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Excluded (open endpoint)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-2 rounded-sm bg-gold" />
          <span className="text-muted-foreground/60 text-xs font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Selected region
          </span>
        </div>
      </div>

      {selected.size > 0 && (
        <p className="mt-3 text-gold-dark text-xs font-semibold" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Selected: {Array.from(selected).map((r) =>
            r === 'left' ? 'x < 3' : r === 'middle' ? '3 < x < 5' : 'x > 5'
          ).join(' and ')}
        </p>
      )}
    </div>
  );
}

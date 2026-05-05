'use client';

import { useEffect, useRef } from 'react';
import { Bot, Loader as Loader2 } from 'lucide-react';

interface TutorFeedbackProps {
  text: string;
  isStreaming: boolean;
  isHint?: boolean;
}

export default function TutorFeedback({ text, isStreaming, isHint = false }: TutorFeedbackProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [text, isStreaming]);

  if (!text && !isStreaming) return null;

  return (
    <div className="bg-navy-light border-l-4 border-gold rounded-r-xl p-5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-7 h-7 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mt-0.5">
          {isStreaming && !text ? (
            <Loader2 className="w-3.5 h-3.5 text-gold animate-spin" />
          ) : (
            <Bot className="w-3.5 h-3.5 text-gold" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            {isHint ? 'Tutor Hint' : 'Tutor Feedback'}
          </p>

          {isStreaming && !text ? (
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-pulse-slow"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          ) : (
            <p
              className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {text}
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-gold/80 ml-0.5 animate-pulse align-text-bottom" />
              )}
            </p>
          )}

          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}

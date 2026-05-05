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
    <div className="bg-[#f0f7ff]/60 backdrop-blur-sm border-2 border-blue-100 rounded-[2rem] p-8 animate-fade-in shadow-xl shadow-blue-900/5">
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-blue-50 rounded-2xl flex items-center justify-center mt-0.5 shadow-sm">
          {isStreaming && !text ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <Bot className="w-5 h-5 text-blue-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-blue-800/40 text-[10px] font-black tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            {isHint ? 'AI Hint' : 'AI Analysis'}
          </p>

          {isStreaming && !text ? (
            <div className="flex items-center gap-2 py-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          ) : (
            <p
              className="text-navy-dark font-medium text-base leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {text}
              {isStreaming && (
                <span className="inline-block w-1 h-5 bg-blue-400 ml-1 animate-pulse align-middle rounded-full" />
              )}
            </p>
          )}

          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}

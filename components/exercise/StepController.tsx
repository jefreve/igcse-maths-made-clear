'use client';

import { useReducer, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InlineMath } from 'react-katex';
import MathInput from './MathInput';
import HintButton from './HintButton';
import TutorFeedback from './TutorFeedback';
import StepCard from './StepCard';
import SignTable from './SignTable';
import NumberLine from './NumberLine';
import ProgressBar from './ProgressBar';
import { detectError, isAnswerCorrect } from '@/lib/errorDetection';
import { STEP_HINTS } from '@/lib/hints';
import type { ExerciseState, StepAttempt, ConversationMessage, ErrorCode } from '@/lib/types';

const initialAttempt = (): StepAttempt => ({
  answer: '',
  errorCode: null,
  feedbackReceived: false,
  hintsUsed: 0,
  status: 'pending',
});

const initialState: ExerciseState = {
  currentStep: 1,
  steps: [
    { ...initialAttempt(), status: 'active' },
    initialAttempt(),
    initialAttempt(),
  ],
  sessionStartedAt: Date.now(),
};

type Action =
  | { type: 'SET_ANSWER'; stepIndex: number; answer: string }
  | { type: 'SET_ERROR'; stepIndex: number; errorCode: ErrorCode }
  | { type: 'INCREMENT_HINT'; stepIndex: number }
  | { type: 'COMPLETE_STEP'; stepIndex: number }
  | { type: 'REVEAL_STEP'; stepIndex: number }
  | { type: 'SET_FEEDBACK_RECEIVED'; stepIndex: number };

function reducer(state: ExerciseState, action: Action): ExerciseState {
  const steps = [...state.steps] as ExerciseState['steps'];

  switch (action.type) {
    case 'SET_ANSWER':
      steps[action.stepIndex] = { ...steps[action.stepIndex], answer: action.answer };
      return { ...state, steps };

    case 'SET_ERROR':
      steps[action.stepIndex] = { ...steps[action.stepIndex], errorCode: action.errorCode };
      return { ...state, steps };

    case 'INCREMENT_HINT':
      steps[action.stepIndex] = {
        ...steps[action.stepIndex],
        hintsUsed: steps[action.stepIndex].hintsUsed + 1,
      };
      return { ...state, steps };

    case 'COMPLETE_STEP': {
      steps[action.stepIndex] = { ...steps[action.stepIndex], status: 'correct' };
      const nextIdx = action.stepIndex + 1;
      if (nextIdx < 3) {
        steps[nextIdx] = { ...steps[nextIdx], status: 'active' };
      }
      return { ...state, steps, currentStep: state.currentStep + 1 };
    }

    case 'REVEAL_STEP':
      steps[action.stepIndex] = { ...steps[action.stepIndex], status: 'revealed' };
      return { ...state, steps };

    case 'SET_FEEDBACK_RECEIVED':
      steps[action.stepIndex] = { ...steps[action.stepIndex], feedbackReceived: true };
      return { ...state, steps };

    default:
      return state;
  }
}

const STEP_CONFIG = [
  {
    title: 'Identify the Domain Conditions',
    description:
      'What conditions must be satisfied for f(x) to be defined? Consider the denominator and the square root.',
    placeholder: 'e.g. The expression inside the square root must be strictly greater than zero...',
  },
  {
    title: 'Solve the Quadratic Inequality',
    description:
      'Solve x² − 8x + 15 > 0. You can use the sign table and number line below as aids.',
    placeholder: 'e.g. x < 3 or x > 5',
  },
  {
    title: 'Write the Final Domain',
    description:
      'Express the complete domain in proper interval notation.',
    placeholder: 'e.g. (-∞, 3) ∪ (5, +∞)',
  },
];

const STEP_TITLES = ['Identify Conditions', 'Solve Inequality', 'Write Domain'];

const REVEALED_ANSWERS = [
  'The expression inside the square root must be strictly greater than zero: x² − 8x + 15 > 0',
  'x < 3 or x > 5',
  '(-∞, 3) ∪ (5, +∞)',
];

export default function StepController() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});
  const [streamingStep, setStreamingStep] = useState<number | null>(null);
  const [isHintMap, setIsHintMap] = useState<Record<number, boolean>>({});
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const stepIndex = state.currentStep - 1;
  const currentStepData = state.steps[stepIndex];
  const MAX_HINTS = 3;

  const streamFeedback = useCallback(async (
    stepNumber: number,
    studentAnswer: string,
    errorCode: ErrorCode,
  ) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStreamingStep(stepNumber);
    setFeedbackMap((prev) => ({ ...prev, [stepNumber]: '' }));
    setIsHintMap((prev) => ({ ...prev, [stepNumber]: false }));

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepNumber,
          studentAnswer,
          errorCode,
          conversationHistory,
        } satisfies import('@/lib/types').TutorRequest),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to connect to tutor');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE format: "data: ...\n\n"
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setFeedbackMap((prev) => ({ ...prev, [stepNumber]: accumulated }));
              }
            } catch {
              // non-JSON chunk — treat as raw text
              if (data && data !== '[DONE]') {
                accumulated += data;
                setFeedbackMap((prev) => ({ ...prev, [stepNumber]: accumulated }));
              }
            }
          }
        }
      }

      // Save to conversation history
      setConversationHistory((prev) => [
        ...prev,
        { role: 'student', content: studentAnswer },
        { role: 'tutor', content: accumulated },
      ]);

      dispatch({ type: 'SET_FEEDBACK_RECEIVED', stepIndex: stepNumber - 1 });
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setFeedbackMap((prev) => ({
          ...prev,
          [stepNumber]: 'Sorry, the tutor is unavailable at the moment. Please try again.',
        }));
      }
    } finally {
      setStreamingStep(null);
    }
  }, [conversationHistory]);

  const handleSubmit = useCallback((stepNum: number) => {
    const idx = stepNum - 1;
    const answer = state.steps[idx].answer.trim();
    if (!answer) return;

    const errorCode = detectError(stepNum, answer);
    dispatch({ type: 'SET_ERROR', stepIndex: idx, errorCode });

    if (isAnswerCorrect(stepNum, answer)) {
      dispatch({ type: 'COMPLETE_STEP', stepIndex: idx });
      if (stepNum === 3) {
        // Navigate to results
        const resultsData = encodeURIComponent(JSON.stringify({
          steps: state.steps.map((s, i) => ({
            ...s,
            answer: i === idx ? answer : s.answer,
          })),
          sessionDuration: Date.now() - state.sessionStartedAt,
        }));
        router.push(`/results?data=${resultsData}`);
      }
    } else {
      streamFeedback(stepNum, answer, errorCode);
    }
  }, [state, streamFeedback, router]);

  const handleHint = useCallback((stepNum: number) => {
    const idx = stepNum - 1;
    const hintsUsed = state.steps[idx].hintsUsed;
    if (hintsUsed >= MAX_HINTS) return;

    dispatch({ type: 'INCREMENT_HINT', stepIndex: idx });

    const hints = STEP_HINTS[stepNum];
    const hintText = hints?.[hintsUsed] ?? 'No more hints available for this step.';

    setIsHintMap((prev) => ({ ...prev, [stepNum]: true }));
    setFeedbackMap((prev) => ({ ...prev, [stepNum]: hintText }));
  }, [state]);

  const handleReveal = useCallback((stepNum: number) => {
    const idx = stepNum - 1;
    dispatch({ type: 'REVEAL_STEP', stepIndex: idx });
    setFeedbackMap((prev) => ({
      ...prev,
      [stepNum]: `The answer for this step is: ${REVEALED_ANSWERS[idx]}`,
    }));
    // Advance to next step after reveal
    dispatch({ type: 'COMPLETE_STEP', stepIndex: idx });
    if (stepNum === 3) {
      const resultsData = encodeURIComponent(JSON.stringify({
        steps: state.steps,
        sessionDuration: Date.now() - state.sessionStartedAt,
      }));
      router.push(`/results?data=${resultsData}`);
    }
  }, [state, router]);

  return (
    <div className="space-y-6">
      <ProgressBar
        currentStep={state.currentStep}
        totalSteps={3}
        stepTitles={STEP_TITLES}
      />

      <div className="space-y-4">
        {STEP_CONFIG.map((config, idx) => {
          const stepNum = idx + 1;
          const step = state.steps[idx];
          const isActive = step.status === 'active';
          const isCompleted = step.status === 'correct' || step.status === 'revealed';
          const feedback = feedbackMap[stepNum] || '';
          const isStreaming = streamingStep === stepNum;
          const isHint = isHintMap[stepNum] ?? false;

          return (
            <StepCard
              key={stepNum}
              stepNumber={stepNum}
              title={config.title}
              description={config.description}
              isActive={isActive}
              isCompleted={isCompleted}
            >
              {/* Step-specific context */}
              {stepNum === 1 && (
                <div className="bg-navy-dark border border-white/10 rounded-lg p-4">
                  <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-3"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Recall the rules
                  </p>
                  <ul className="space-y-2">
                    {[
                      'The denominator of a fraction cannot equal zero.',
                      'The expression inside a square root must be ≥ 0.',
                      'Since the square root is the denominator, it must be strictly > 0.',
                    ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70"
                        style={{ fontFamily: 'var(--font-montserrat)' }}>
                        <span className="text-gold mt-0.5 font-bold text-xs">{i + 1}.</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {stepNum === 2 && (
                <div className="space-y-4">
                  <div className="bg-navy-dark border border-white/10 rounded-lg p-4">
                    <p className="text-white/60 text-xs mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                      We need to solve:
                    </p>
                    <div className="text-lg">
                      <InlineMath math="x^{2} - 8x + 15 > 0" />
                    </div>
                    <p className="text-white/50 text-xs mt-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                      Hint: factorise as <InlineMath math="(x-3)(x-5) > 0" />
                    </p>
                  </div>
                  <SignTable disabled={!isActive} />
                  <NumberLine disabled={!isActive} />
                </div>
              )}

              {stepNum === 3 && (
                <div className="bg-navy-dark border border-white/10 rounded-lg p-4">
                  <p className="text-white/60 text-xs mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    From Step 2, we know the solution is <InlineMath math="x < 3" /> or <InlineMath math="x > 5" />.
                    Express this as a domain in interval notation.
                  </p>
                  <p className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Remember: use ( ) for excluded endpoints, ∪ to join intervals.
                  </p>
                </div>
              )}

              {/* Input area */}
              <MathInput
                value={step.answer}
                onChange={(val) => dispatch({ type: 'SET_ANSWER', stepIndex: idx, answer: val })}
                placeholder={config.placeholder}
                disabled={!isActive}
              />

              {/* Feedback */}
              {(feedback || isStreaming) && (
                <TutorFeedback
                  text={feedback}
                  isStreaming={isStreaming}
                  isHint={isHint}
                />
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <HintButton
                  onRequestHint={() => handleHint(stepNum)}
                  isLoading={isStreaming && isHint}
                  hintsUsed={step.hintsUsed}
                  maxHints={MAX_HINTS}
                  disabled={!isActive || (isStreaming && !isHint)}
                />

                <div className="flex items-center gap-3">
                  {step.hintsUsed >= MAX_HINTS && !step.feedbackReceived && (
                    <button
                      onClick={() => handleReveal(stepNum)}
                      className="text-white/40 hover:text-white/60 text-xs underline underline-offset-2 transition-colors"
                      style={{ fontFamily: 'var(--font-montserrat)' }}
                    >
                      See answer
                    </button>
                  )}

                  <button
                    onClick={() => handleSubmit(stepNum)}
                    disabled={!isActive || !step.answer.trim() || isStreaming}
                    className={`
                      inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm
                      transition-all duration-150
                      ${!isActive || !step.answer.trim() || isStreaming
                        ? 'bg-white/10 text-white/30 cursor-not-allowed'
                        : 'bg-gold hover:bg-gold-dark text-navy-dark cursor-pointer hover:scale-105 active:scale-95 shadow-md'}
                    `}
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    Check Answer
                  </button>
                </div>
              </div>
            </StepCard>
          );
        })}
      </div>
    </div>
  );
}


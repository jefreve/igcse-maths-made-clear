import type { ErrorCode } from './types';

/**
 * Detects which specific error pattern a student's answer contains for
 * the domain-finding exercise f(x) = (x²-3) / √(x²-8x+15).
 * Returns null if no known error is detected.
 */
export function detectError(stepNumber: number, answer: string): ErrorCode {
  const normalised = answer.toLowerCase().replace(/\s+/g, ' ').trim();

  if (!normalised) return null;

  // Step 1: Identifying domain conditions
  if (stepNumber === 1) {
    // Student doesn't mention the denominator or strict inequality at all
    if (
      (normalised.includes('≥') || normalised.includes('>=')) &&
      !normalised.includes('>') &&
      !normalised.includes('≠') &&
      !normalised.includes('!=') &&
      !normalised.includes('not equal') &&
      !normalised.includes('≠ 0')
    ) {
      return 'FORGOT_DENOM';
    }
    // Student uses ≥ 0 as the only condition (should be > 0 because sqrt is in denominator)
    if (
      (normalised.includes('≥ 0') || normalised.includes('>= 0')) &&
      !normalised.includes('> 0') &&
      !normalised.includes('> 0')
    ) {
      return 'GEQ_NOT_GT';
    }
  }

  // Step 2: Solving the quadratic inequality
  if (stepNumber === 2) {
    // Student only lists x=3 and x=5 as the answer (critical values, not solution)
    const onlyRootsPattern =
      /x\s*=\s*3\s*(and|or|,)\s*x\s*=\s*5|x\s*=\s*[35]\s*(,|and|or)\s*x\s*=\s*[35]/i;
    if (
      onlyRootsPattern.test(answer) &&
      !answer.includes('<') &&
      !answer.includes('>') &&
      !answer.includes('(-') &&
      !answer.includes('∞') &&
      !answer.includes('infinity')
    ) {
      return 'ONLY_ROOTS';
    }

    // Student selects the interval (3, 5) — between the roots
    if (
      answer.includes('(3, 5)') ||
      answer.includes('(3,5)') ||
      normalised.includes('3 < x < 5') ||
      normalised.includes('3<x<5') ||
      normalised.match(/x\s*>\s*3\s*(and|&&)\s*x\s*<\s*5/) !== null ||
      normalised.match(/x\s*<\s*5\s*(and|&&)\s*x\s*>\s*3/) !== null
    ) {
      return 'INTERVAL_3_5';
    }
  }

  // Step 3: Final domain in interval notation
  if (stepNumber === 3) {
    // Student includes 3 or 5 as closed endpoints [3 or 5]
    if (
      answer.includes('[3') ||
      answer.includes('3]') ||
      answer.includes('[5') ||
      answer.includes('5]') ||
      normalised.includes('x ≤ 3') ||
      normalised.includes('x <= 3') ||
      normalised.includes('x ≥ 5') ||
      normalised.includes('x >= 5')
    ) {
      return 'INCLUDES_ENDPOINT';
    }

    // Student selects (3, 5) as the domain even in final step
    if (
      answer.includes('(3, 5)') ||
      answer.includes('(3,5)') ||
      normalised.includes('3 < x < 5') ||
      normalised.includes('3<x<5')
    ) {
      return 'INTERVAL_3_5';
    }
  }

  return null;
}

/**
 * Checks if a step answer is correct for the domain exercise.
 * Used to determine whether to advance the student to the next step.
 */
export function isAnswerCorrect(stepNumber: number, answer: string): boolean {
  const normalised = answer.toLowerCase().replace(/\s+/g, ' ').trim();

  if (stepNumber === 1) {
    // Correct: student identifies that x² - 8x + 15 > 0 (strictly greater)
    return (
      (normalised.includes('> 0') || normalised.includes('>0')) &&
      (normalised.includes('x²') ||
        normalised.includes('x^2') ||
        normalised.includes('x2') ||
        normalised.includes('8x') ||
        normalised.includes('denominator'))
    );
  }

  if (stepNumber === 2) {
    // Correct: x < 3 or x > 5
    return (
      (normalised.includes('x < 3') ||
        normalised.includes('x<3') ||
        normalised.includes('(-∞, 3)') ||
        normalised.includes('(-inf, 3)')) &&
      (normalised.includes('x > 5') ||
        normalised.includes('x>5') ||
        normalised.includes('(5, ∞)') ||
        normalised.includes('(5, inf)'))
    );
  }

  if (stepNumber === 3) {
    // Correct: (-∞, 3) ∪ (5, +∞) or equivalent
    return (
      (normalised.includes('(-∞, 3)') ||
        normalised.includes('(-inf, 3)') ||
        normalised.includes('(-infinity, 3)') ||
        normalised.includes('x < 3')) &&
      (normalised.includes('(5, ∞)') ||
        normalised.includes('(5, +∞)') ||
        normalised.includes('(5, inf)') ||
        normalised.includes('(5, +inf)') ||
        normalised.includes('x > 5')) &&
      (normalised.includes('∪') ||
        normalised.includes('union') ||
        normalised.includes('or'))
    );
  }

  return false;
}

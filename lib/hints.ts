/**
 * Static hints for each step, taken from the PDF:
 * "Domain_Quadratic_Denominator_Example_with_Feedback.pdf"
 *
 * Each step has up to 3 progressive hints, shown one at a time
 * when the student clicks the Hint button.
 */
export const STEP_HINTS: Record<number, string[]> = {
  1: [
    'Remember the two main rules. The denominator cannot be equal to zero. Before solving anything, write down the condition that prevents division by zero.',
    'Remember that the expression inside a square root must be greater than or equal to zero. First, identify what is inside the square root, then write the correct inequality.',
    'Be careful: when you combine the two conditions, both must be satisfied at the same time. Since the square root is in the denominator, it cannot be zero either — so the combined condition is x² − 8x + 15 > 0.',
  ],
  2: [
    'To solve a quadratic inequality, first solve the related quadratic equation. This gives you the key values to place on the number line.',
    'Look for two numbers that multiply to 15 and add to −8. These are −3 and −5, so x² − 8x + 15 = (x − 3)(x − 5) = 0 gives x = 3 and x = 5.',
    'The critical values x = 3 and x = 5 split the number line into three intervals. Since the coefficient of x² is positive, the parabola opens upwards — so the expression is positive outside the roots. The answer is x < 3 or x > 5.',
  ],
  3: [
    'Check whether the end points should be included or excluded. Since the denominator cannot be zero, any value that makes the denominator zero must be excluded — so use open brackets ( ).',
    'Use ( ) for excluded endpoints and ∪ to join the two separate intervals.',
    'The domain is all x < 3 or x > 5. Written in interval notation: (−∞, 3) ∪ (5, +∞).',
  ],
};

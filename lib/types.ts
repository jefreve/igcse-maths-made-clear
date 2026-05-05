export type ErrorCode =
  | 'INCLUDES_ENDPOINT'   // Student includes x=3 or x=5 as closed boundary
  | 'INTERVAL_3_5'        // Student selects (3,5) as the domain
  | 'GEQ_NOT_GT'          // Student writes ≥ 0 instead of > 0 as final condition
  | 'ONLY_ROOTS'          // Student gives x=3 and x=5 without solving inequality
  | 'FORGOT_DENOM'        // Student ignores denominator restriction entirely
  | null;

export type StepStatus = 'pending' | 'active' | 'correct' | 'revealed';

export interface StepAttempt {
  answer: string;
  errorCode: ErrorCode;
  feedbackReceived: boolean;
  hintsUsed: number;
  status: StepStatus;
}

export interface ExerciseState {
  currentStep: number;
  steps: [StepAttempt, StepAttempt, StepAttempt];
  sessionStartedAt: number;
}

export interface TutorRequest {
  stepNumber: number;
  studentAnswer: string;
  errorCode: ErrorCode;
  conversationHistory: ConversationMessage[];
}

export interface ConversationMessage {
  role: 'student' | 'tutor';
  content: string;
}

export interface AssessmentDimension {
  label: string;
  score: 'correct' | 'guided' | 'revealed';
}

export interface StepAssessment {
  stepNumber: number;
  stepTitle: string;
  dimensions: {
    reasoning: AssessmentDimension;
    algebra: AssessmentDimension;
    notation: AssessmentDimension;
  };
  hintsUsed: number;
}

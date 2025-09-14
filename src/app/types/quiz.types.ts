export interface Question {
  id: string | number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizState {
  readonly currentQuestionIndex: number;
  readonly questions: Question[];
  readonly userAnswers: Map<string, string>;
}

export interface QuizResult {
  readonly question: string;
  readonly userAnswer: string;
  readonly correctAnswer: string;
  readonly isCorrect: boolean;
}
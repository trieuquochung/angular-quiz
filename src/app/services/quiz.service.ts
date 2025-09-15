import { inject, Injectable } from '@angular/core';
import { computed, signal } from '@angular/core';
import { Question, QuizState, QuizResult } from '../types/quiz.types';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private firebaseService = inject(FirebaseService);

  // State management using signals
  private state = signal<QuizState>({
    currentQuestionIndex: 0,
    questions: [],
    userAnswers: new Map()
  });

  // Computed values
  readonly currentQuestion = computed(() => {
    const questions = this.state().questions;
    const index = this.state().currentQuestionIndex;
    return questions[index];
  });

  readonly progress = computed(() => {
    const total = this.state().questions.length;
    return total ? ((this.state().currentQuestionIndex + 1) / total) * 100 : 0;
  });

  readonly isLastQuestion = computed(() => {
    return this.state().currentQuestionIndex === this.state().questions.length - 1;
  });

  readonly questions = computed(() => this.state().questions);
  readonly currentIndex = computed(() => this.state().currentQuestionIndex);
  readonly userAnswers = computed(() => this.state().userAnswers);

  // API methods
  loadQuestions() {
    // This method is deprecated - use loadQuestionsForCategory instead
    console.warn('loadQuestions() is deprecated. Use setQuestions() instead.');
  }

  setQuestions(questions: Question[]) {
    this.state.update(state => ({
      ...state,
      questions,
      currentQuestionIndex: 0,
      userAnswers: new Map()
    }));
  }

  // Actions
  submitAnswer(answer: string) {
    const currentQuestion = this.currentQuestion();
    if (!currentQuestion) return;

    this.state.update(state => ({
      ...state,
      userAnswers: new Map(state.userAnswers).set(String(currentQuestion.id), answer)
    }));
  }

  nextQuestion() {
    if (!this.isLastQuestion()) {
      this.state.update(state => ({
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      }));
    }
  }

  getResults(): QuizResult[] {
    const state = this.state();
    return state.questions.map(question => ({
      question: question.question,
      userAnswer: state.userAnswers.get(String(question.id)) ?? 'Not answered',
      correctAnswer: question.correctAnswer,
      isCorrect: state.userAnswers.get(String(question.id)) === question.correctAnswer
    }));
  }

  getScore(): { score: number; total: number } {
    const results = this.getResults();
    return {
      score: results.filter(r => r.isCorrect).length,
      total: results.length
    };
  }

  resetQuiz() {
    this.state.update(state => ({
      ...state,
      currentQuestionIndex: 0,
      userAnswers: new Map()
    }));
  }

  // Save quiz results to Firebase
  saveResults() {
    const results = this.getResults();
    const { score, total } = this.getScore();
    
    this.firebaseService.saveQuizResult(results, score, total).subscribe(
      (sessionId) => {
        console.log('Quiz results saved with session ID:', sessionId);
      }
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:3000';
  private questions$ = new BehaviorSubject<Question[]>([]);
  private userAnswers: Map<number, string> = new Map();

  constructor(private http: HttpClient) {}

  loadQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`).pipe(
      map(questions => {
        this.questions$.next(questions);
        return questions;
      })
    );
  }

  getQuestions(): Observable<Question[]> {
    return this.questions$.asObservable();
  }

  submitAnswer(questionId: number, answer: string): void {
    this.userAnswers.set(questionId, answer);
  }

  getResults(): QuizResult[] {
    const questions = this.questions$.getValue();
    return questions.map(q => ({
      question: q.question,
      userAnswer: this.userAnswers.get(q.id) || 'Not answered',
      correctAnswer: q.correctAnswer,
      isCorrect: this.userAnswers.get(q.id) === q.correctAnswer
    }));
  }

  getScore(): { score: number, total: number } {
    const questions = this.questions$.getValue();
    const correctAnswers = questions.filter(q => 
      this.userAnswers.get(q.id) === q.correctAnswer
    ).length;
    return {
      score: correctAnswers,
      total: questions.length
    };
  }

  resetQuiz(): void {
    this.userAnswers.clear();
  }
}
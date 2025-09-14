import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Question, QuizResult } from '../types/quiz.types';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  data?: T;
}

interface QuestionResponse {
  questions: Question[];
}

interface StatsResponse {
  totalQuestions: number;
  totalResults: number;
  averageScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // Cloud Functions API URL from environment configuration
  private readonly API_BASE_URL = environment.apiUrl;

  // Questions API
  getQuestions(): Observable<Question[]> {
    return this.http.get<QuestionResponse>(`${this.API_BASE_URL}/quiz`)
      .pipe(
        map((response: QuestionResponse) => response.questions)
      );
  }

  addQuestion(question: Omit<Question, 'id'>): Observable<{ id: string; success: boolean }> {
    return this.http.post<{ id: string; success: boolean }>(`${this.API_BASE_URL}/questions`, question);
  }

  updateQuestion(id: string | number, question: Partial<Question>): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.API_BASE_URL}/questions/${id}`, question);
  }

  deleteQuestion(id: string | number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.API_BASE_URL}/questions/${id}`);
  }

  // Quiz Results API
  saveQuizResult(result: {
    answers: any[];
    score: number;
    totalQuestions: number;
    completedAt: Date;
  }): Observable<{ id: string; success: boolean }> {
    return this.http.post<{ id: string; success: boolean }>(`${this.API_BASE_URL}/submit`, result);
  }

  // Statistics API
  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.API_BASE_URL}/stats`);
  }

  // Health check
  healthCheck(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.API_BASE_URL}/health`);
  }
}
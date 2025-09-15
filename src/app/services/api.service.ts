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
  
  // Note: This service is for Cloud Functions API (not used in zero-cost architecture)
  // Using Firestore directly through FirebaseService instead
  // These methods are stubs to prevent build errors

  // Questions API
  getQuestions(): Observable<Question[]> {
    // Stub method - use FirebaseService.getQuestions() instead
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  addQuestion(question: Omit<Question, 'id'>): Observable<{ id: string; success: boolean }> {
    // Stub method - use FirebaseService.addQuestion() instead
    return new Observable(observer => {
      observer.next({ id: '', success: false });
      observer.complete();
    });
  }

  updateQuestion(id: string | number, question: Partial<Question>): Observable<{ success: boolean }> {
    // Stub method - use FirebaseService.updateQuestion() instead
    return new Observable(observer => {
      observer.next({ success: false });
      observer.complete();
    });
  }

  deleteQuestion(id: string | number): Observable<{ success: boolean }> {
    // Stub method - use FirebaseService.deleteQuestion() instead
    return new Observable(observer => {
      observer.next({ success: false });
      observer.complete();
    });
  }

  // Quiz Results API
  saveQuizResult(result: {
    answers: any[];
    score: number;
    totalQuestions: number;
    completedAt: Date;
  }): Observable<{ id: string; success: boolean }> {
    // Stub method - use FirebaseService.saveQuizResult() instead
    return new Observable(observer => {
      observer.next({ id: '', success: false });
      observer.complete();
    });
  }

  // Statistics API
  getStats(): Observable<StatsResponse> {
    // Stub method - implement using FirebaseService queries
    return new Observable(observer => {
      observer.next({ 
        totalQuestions: 0, 
        totalResults: 0, 
        averageScore: 0
      });
      observer.complete();
    });
  }

  // Health check
  healthCheck(): Observable<{ status: string; timestamp: string }> {
    // Stub method - not needed for client-side only architecture
    return new Observable(observer => {
      observer.next({ status: 'ok', timestamp: new Date().toISOString() });
      observer.complete();
    });
  }
}
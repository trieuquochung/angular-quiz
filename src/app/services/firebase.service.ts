import { inject, Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  CollectionReference,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Question, QuizResult } from '../types/quiz.types';

export interface FirebaseQuestion extends Omit<Question, 'id'> {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuizSession {
  id?: string;
  userId?: string;
  sessionId: string;
  results: QuizResult[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

export type QuizCategory = 'ms-word' | 'ms-excel' | 'ms-powerpoint';

export interface QuizCategoryInfo {
  id: QuizCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(Firestore);
  
  private resultsCollection = collection(this.firestore, 'quizResults') as CollectionReference<QuizSession>;

  // Category definitions
  readonly categories: QuizCategoryInfo[] = [
    {
      id: 'ms-word',
      name: 'Microsoft Word',
      icon: 'description',
      description: 'Test your Microsoft Word skills',
      color: '#2B579A'
    },
    {
      id: 'ms-excel',
      name: 'Microsoft Excel',
      icon: 'grid_on',
      description: 'Test your Microsoft Excel skills',
      color: '#217346'
    },
    {
      id: 'ms-powerpoint',
      name: 'Microsoft PowerPoint',
      icon: 'slideshow',
      description: 'Test your Microsoft PowerPoint skills',
      color: '#D24726'
    }
  ];

  // Get collection for specific category
  private getQuestionsCollection(category: QuizCategory): CollectionReference<FirebaseQuestion> {
    return collection(this.firestore, category) as CollectionReference<FirebaseQuestion>;
  }

  // Questions CRUD operations with category support
  getQuestions(category: QuizCategory): Observable<Question[]> {
    const categoryCollection = this.getQuestionsCollection(category);
    return from(getDocs(categoryCollection)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Question))
      )
    );
  }

  addQuestion(category: QuizCategory, question: Omit<Question, 'id'>): Observable<string> {
    const categoryCollection = this.getQuestionsCollection(category);
    const questionData: FirebaseQuestion = {
      ...question,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return from(addDoc(categoryCollection, questionData)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateQuestion(category: QuizCategory, id: string, question: Partial<Omit<Question, 'id'>>): Observable<void> {
    const questionRef = doc(this.firestore, category, id) as DocumentReference<FirebaseQuestion>;
    const updateData: Partial<FirebaseQuestion> = {
      ...question,
      updatedAt: new Date()
    };
    return from(updateDoc(questionRef, updateData));
  }

  deleteQuestion(category: QuizCategory, id: string): Observable<void> {
    const questionRef = doc(this.firestore, category, id);
    return from(deleteDoc(questionRef));
  }

  // Quiz Results operations
  saveQuizResult(results: QuizResult[], score: number, totalQuestions: number): Observable<string> {
    const quizSession: Omit<QuizSession, 'id'> = {
      sessionId: this.generateSessionId(),
      results,
      score,
      totalQuestions,
      completedAt: new Date()
    };
    
    return from(addDoc(this.resultsCollection, quizSession)).pipe(
      map(docRef => docRef.id)
    );
  }

  getQuizResults(): Observable<QuizSession[]> {
    return from(getDocs(this.resultsCollection)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as QuizSession))
      )
    );
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
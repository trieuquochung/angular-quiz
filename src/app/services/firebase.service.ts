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

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(Firestore);
  
  private questionsCollection = collection(this.firestore, 'questions') as CollectionReference<FirebaseQuestion>;
  private resultsCollection = collection(this.firestore, 'quizResults') as CollectionReference<QuizSession>;

  // Questions CRUD operations
  getQuestions(): Observable<Question[]> {
    return from(getDocs(this.questionsCollection)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Question))
      )
    );
  }

  addQuestion(question: Omit<Question, 'id'>): Observable<string> {
    const questionData: FirebaseQuestion = {
      ...question,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return from(addDoc(this.questionsCollection, questionData)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateQuestion(id: string, question: Partial<Omit<Question, 'id'>>): Observable<void> {
    const questionRef = doc(this.firestore, 'questions', id) as DocumentReference<FirebaseQuestion>;
    const updateData: Partial<FirebaseQuestion> = {
      ...question,
      updatedAt: new Date()
    };
    return from(updateDoc(questionRef, updateData));
  }

  deleteQuestion(id: string): Observable<void> {
    const questionRef = doc(this.firestore, 'questions', id);
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
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from '../../services/firebase.service';
import { Question } from '../../types/quiz.types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule
  ],
  template: `
    <div class="admin-container">
      <h1>Quiz Administration</h1>
      
      <!-- Add/Edit Question Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ editingQuestion ? 'Edit Question' : 'Add New Question' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="questionForm" (ngSubmit)="saveQuestion()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Question</mat-label>
              <textarea matInput formControlName="question" rows="3"></textarea>
            </mat-form-field>

            <div class="options-container">
              <h3>Answer Options</h3>
              @for (option of optionsArray.controls; track option; let i = $index) {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Option {{ i + 1 }}</mat-label>
                  <input matInput [formControlName]="i">
                </mat-form-field>
              }
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correct Answer</mat-label>
              <input matInput formControlName="correctAnswer">
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!questionForm.valid">
                {{ editingQuestion ? 'Update Question' : 'Add Question' }}
              </button>
              @if (editingQuestion) {
                <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
              }
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Questions List -->
      <mat-card class="questions-card">
        <mat-card-header>
          <mat-card-title>Existing Questions</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="questions-list">
            @for (question of questions; track question.id) {
              <div class="question-item">
                <div class="question-content">
                  <h4>{{ question.question }}</h4>
                  <p><strong>Options:</strong> {{ question.options.join(', ') }}</p>
                  <p><strong>Correct Answer:</strong> {{ question.correctAnswer }}</p>
                </div>
                <div class="question-actions">
                  <button mat-icon-button color="primary" (click)="editQuestion(question)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteQuestion(question.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            }
            
            @if (questions.length === 0) {
              <p class="no-questions">No questions available. Add some questions to get started!</p>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-card, .questions-card {
      margin-bottom: 2rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .options-container {
      margin: 1rem 0;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-start;
      margin-top: 1rem;
    }

    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .question-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .question-content {
      flex: 1;
      margin-right: 1rem;
    }

    .question-content h4 {
      margin: 0 0 0.5rem 0;
    }

    .question-content p {
      margin: 0.25rem 0;
      color: #666;
    }

    .question-actions {
      display: flex;
      gap: 0.5rem;
    }

    .no-questions {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 2rem;
    }
  `]
})
export class AdminComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  
  questions: Question[] = [];
  editingQuestion: Question | null = null;

  questionForm = this.fb.group({
    question: ['', Validators.required],
    options: this.fb.array([
      this.fb.control('', Validators.required),
      this.fb.control('', Validators.required),
      this.fb.control('', Validators.required),
      this.fb.control('', Validators.required)
    ]),
    correctAnswer: ['', Validators.required]
  });

  get optionsArray() {
    return this.questionForm.get('options') as any;
  }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.firebaseService.getQuestions().subscribe(
      questions => {
        this.questions = questions;
      },
      error => {
        this.snackBar.open('Error loading questions', 'Close', { duration: 3000 });
      }
    );
  }

  saveQuestion() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData = {
        question: formValue.question!,
        options: formValue.options!.filter((opt): opt is string => opt !== null),
        correctAnswer: formValue.correctAnswer!
      };

      if (this.editingQuestion) {
        this.firebaseService.updateQuestion(String(this.editingQuestion.id), questionData).subscribe(
          () => {
            this.snackBar.open('Question updated successfully', 'Close', { duration: 3000 });
            this.loadQuestions();
            this.cancelEdit();
          },
          error => {
            this.snackBar.open('Error updating question', 'Close', { duration: 3000 });
          }
        );
      } else {
        this.firebaseService.addQuestion(questionData).subscribe(
          () => {
            this.snackBar.open('Question added successfully', 'Close', { duration: 3000 });
            this.loadQuestions();
            this.questionForm.reset();
          },
          error => {
            this.snackBar.open('Error adding question', 'Close', { duration: 3000 });
          }
        );
      }
    }
  }

  editQuestion(question: Question) {
    this.editingQuestion = question;
    this.questionForm.patchValue({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer
    });
  }

  cancelEdit() {
    this.editingQuestion = null;
    this.questionForm.reset();
  }

  deleteQuestion(id: string | number) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.firebaseService.deleteQuestion(String(id)).subscribe(
        () => {
          this.snackBar.open('Question deleted successfully', 'Close', { duration: 3000 });
          this.loadQuestions();
        },
        error => {
          this.snackBar.open('Error deleting question', 'Close', { duration: 3000 });
        }
      );
    }
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  template: `
    <div class="quiz-container">
      <mat-card>
        @if (currentQuestion()) {
          <mat-card-header>
            <mat-card-title>
              Question {{ currentIndex() + 1 }} of {{ questions().length }}
            </mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <mat-progress-bar
              mode="determinate"
              [value]="progress()"
            ></mat-progress-bar>

            <div class="question-content">
              <p>{{ currentQuestion().question }}</p>

              <mat-radio-group [(ngModel)]="selectedAnswer" class="answer-options">
                @for (option of currentQuestion().options; track option) {
                  <mat-radio-button [value]="option" class="answer-option">
                    {{ option }}
                  </mat-radio-button>
                }
              </mat-radio-group>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button
              mat-raised-button
              color="primary"
              [disabled]="!selectedAnswer"
              (click)="submitAnswer()"
            >
              {{ isLastQuestion() ? 'Finish Quiz' : 'Next Question' }}
            </button>
          </mat-card-actions>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .quiz-container {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }

    mat-card {
      max-width: 800px;
      width: 100%;
    }

    .question-content {
      padding: 2rem 1rem;
    }

    .answer-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 1rem;
    }
  `]
})
export class QuizComponent implements OnInit {
  private quizService = inject(QuizService);
  private router = inject(Router);

  selectedAnswer: string | null = null;

  // Computed values from service
  readonly currentQuestion = this.quizService.currentQuestion;
  readonly progress = this.quizService.progress;
  readonly isLastQuestion = this.quizService.isLastQuestion;
  readonly questions = this.quizService.questions;
  readonly currentIndex = this.quizService.currentIndex;

  ngOnInit() {
    this.quizService.loadQuestions();
  }

  submitAnswer() {
    if (this.selectedAnswer) {
      this.quizService.submitAnswer(this.selectedAnswer);
      
      if (this.isLastQuestion()) {
        // Save results to Firebase before navigating
        this.quizService.saveResults();
        this.router.navigate(['/results']);
      } else {
        this.quizService.nextQuestion();
        this.selectedAnswer = null;
      }
    }
  }
}

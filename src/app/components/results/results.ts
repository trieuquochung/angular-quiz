import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { QuizService } from '../../services/quiz.service';
import { QuizResult } from '../../types/quiz.types';

@Component({
  selector: 'app-results',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="results-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Quiz Results</mat-card-title>
          <mat-card-subtitle>
            Your Score: {{ score }} out of {{ totalQuestions }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @for (result of results; track result.question) {
            <div 
              class="result-item"
              [class.correct]="result.isCorrect"
              [class.incorrect]="!result.isCorrect"
            >
              <h3>{{ result.question }}</h3>
              <div class="answer-details">
                <p>
                  <mat-icon>{{ result.isCorrect ? 'check_circle' : 'error' }}</mat-icon>
                  Your answer: {{ result.userAnswer }}
                </p>
                @if (!result.isCorrect) {
                  <p class="correct-answer">
                    Correct answer: {{ result.correctAnswer }}
                  </p>
                }
              </div>
            </div>
            <mat-divider></mat-divider>
          }
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/quiz">
            Try Again
          </button>
          <button mat-button routerLink="/">
            Back to Home
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .results-container {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }

    mat-card {
      max-width: 800px;
      width: 100%;
    }

    .result-item {
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 4px;

      &.correct {
        background-color: rgba(76, 175, 80, 0.1);
      }

      &.incorrect {
        background-color: rgba(244, 67, 54, 0.1);
      }

      h3 {
        margin: 0 0 1rem 0;
      }
    }

    .answer-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      p {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
      }

      .correct-answer {
        color: #f44336;
      }
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1rem;
    }
  `]
})
export class ResultsComponent implements OnInit {
  private quizService = inject(QuizService);
  
  score = 0;
  totalQuestions = 0;
  results: QuizResult[] = [];

  ngOnInit() {
    this.results = this.quizService.getResults();
    const scoreResult = this.quizService.getScore();
    this.score = scoreResult.score;
    this.totalQuestions = scoreResult.total;
  }
}

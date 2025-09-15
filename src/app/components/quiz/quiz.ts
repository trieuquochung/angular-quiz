import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { FirebaseService, QuizCategory } from '../../services/firebase.service';

@Component({
  selector: 'app-quiz',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizComponent implements OnInit, OnDestroy {
  private quizService = inject(QuizService);
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  
  private subscriptions = new Subscription();

  // Signal-based state
  selectedAnswer = signal<string | null>(null);
  isLoading = signal(false);
  selectedCategory = signal<QuizCategory | null>(null);
  errorMessage = signal<string | null>(null);

  // Computed values from service
  readonly currentQuestion = this.quizService.currentQuestion;
  readonly progress = this.quizService.progress;
  readonly isLastQuestion = this.quizService.isLastQuestion;
  readonly questions = this.quizService.questions;
  readonly currentIndex = this.quizService.currentIndex;

  ngOnInit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    // Get category from query parameters
    const subscription = this.route.queryParams.subscribe(params => {
      const category = params['category'] as QuizCategory;
      this.selectedCategory.set(category);
      
      if (category) {
        this.loadCategoryQuestions(category);
      } else {
        // If no category specified, redirect to home
        this.router.navigate(['/']);
      }
    });
    
    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadCategoryQuestions(category: QuizCategory) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    const subscription = this.firebaseService.getQuestions(category).subscribe({
      next: (questions) => {
        this.quizService.setQuestions(questions);
        this.isLoading.set(false);
        this.errorMessage.set(null);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load quiz questions. Please try again.');
        this.snackBar.open('Error loading questions from Firebase', 'Close', { duration: 3000 });
      }
    });
    
    this.subscriptions.add(subscription);
  }

  getCategoryName(): string {
    const category = this.selectedCategory();
    if (!category) return '';
    const categoryInfo = this.firebaseService.categories.find(c => c.id === category);
    return categoryInfo ? categoryInfo.name : category;
  }

  getOptionLabel(index: number): string {
    return ['A', 'B', 'C', 'D'][index] || '';
  }

  retryLoad() {
    const category = this.selectedCategory();
    if (category) {
      this.loadCategoryQuestions(category);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  previousQuestion() {
    // Implementation would go here - not in current quiz service
    // For now, just clear the selected answer
    this.selectedAnswer.set(null);
  }

  submitAnswer() {
    const answer = this.selectedAnswer();
    if (answer) {
      this.quizService.submitAnswer(answer);
      
      if (this.isLastQuestion()) {
        // Save results to Firebase before navigating
        this.quizService.saveResults();
        this.router.navigate(['/results']);
      } else {
        this.quizService.nextQuestion();
        this.selectedAnswer.set(null);
      }
    }
  }
}

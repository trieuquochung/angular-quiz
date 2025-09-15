import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { FirebaseService, QuizCategory } from '../../services/firebase.service';
import { Question } from '../../types/quiz.types';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions = new Subscription();
  
  // State management
  questions: Question[] = [];
  editingQuestion: Question | null = null;
  correctAnswerIndex = -1;
  selectedCategory: QuizCategory | null = null;
  isLoadingQuestions = false;
  
  isLoadingBulk = false;
  showPreview = false;
  bulkStatusMessages: { text: string; success: boolean }[] = [];
  
  categories = [
    { value: 'ms-word' as QuizCategory, label: 'Microsoft Word' },
    { value: 'ms-excel' as QuizCategory, label: 'Microsoft Excel' },
    { value: 'ms-powerpoint' as QuizCategory, label: 'Microsoft PowerPoint' }
  ];

  questionForm = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(10)]],
    answers: this.fb.array([
      this.fb.control('', [Validators.required, Validators.minLength(1)]),
      this.fb.control('', [Validators.required, Validators.minLength(1)]),
      this.fb.control('', [Validators.required, Validators.minLength(1)]),
      this.fb.control('', [Validators.required, Validators.minLength(1)])
    ])
  });

  get answersArray(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  ngOnInit(): void {
    this.selectedCategory = 'ms-word';
    this.loadQuestions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCategoryChange(): void {
    this.questions = [];
    this.editingQuestion = null;
    this.resetForm();
    this.loadQuestions();
  }

  loadQuestions(): void {
    if (!this.selectedCategory) return;

    this.isLoadingQuestions = true;
    
    const questionSub = this.firebaseService
      .getQuestions(this.selectedCategory)
      .subscribe({
        next: (questions) => {
          this.questions = questions;
          this.isLoadingQuestions = false;
          console.log('Loaded questions:', questions);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          this.snackBar.open('Error loading questions', 'Close', { duration: 3000 });
          this.isLoadingQuestions = false;
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.add(questionSub);
  }

  getCategoryName(category: QuizCategory): string {
    const categoryMap = {
      'ms-word': 'Microsoft Word',
      'ms-excel': 'Microsoft Excel', 
      'ms-powerpoint': 'Microsoft PowerPoint'
    };
    return categoryMap[category] || category;
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.correctAnswerIndex = parseInt(question.correctAnswer);
    
    this.questionForm.patchValue({
      text: question.question,
      answers: question.options
    });
    this.cdr.markForCheck();
  }

  deleteQuestion(question: Question): void {
    if (!this.selectedCategory) return;

    if (confirm('Are you sure you want to delete this question?')) {
      const deleteSub = this.firebaseService
        .deleteQuestion(this.selectedCategory, question.id.toString())
        .subscribe({
          next: () => {
            this.snackBar.open('Question deleted successfully', 'Close', { duration: 3000 });
            this.loadQuestions();
          },
          error: (error) => {
            console.error('Error deleting question:', error);
            this.snackBar.open('Error deleting question', 'Close', { duration: 3000 });
          }
        });

      this.subscriptions.add(deleteSub);
    }
  }

  setCorrectAnswer(index: number): void {
    this.correctAnswerIndex = index;
    this.cdr.markForCheck();
  }

  resetForm(): void {
    this.editingQuestion = null;
    this.correctAnswerIndex = -1;
    this.questionForm.reset();
    
    // Reset all answer controls
    this.answersArray.controls.forEach(control => control.setValue(''));
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (!this.questionForm.valid || this.correctAnswerIndex === -1 || !this.selectedCategory) {
      this.snackBar.open('Please fill all fields and select a correct answer', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.questionForm.value;
    const questionData: Omit<Question, 'id'> = {
      question: formValue.text!,
      options: formValue.answers as string[],
      correctAnswer: this.correctAnswerIndex.toString()
    };

    if (this.editingQuestion) {
      // Update existing question
      const updateSub = this.firebaseService
        .updateQuestion(this.selectedCategory, this.editingQuestion.id.toString(), questionData)
        .subscribe({
          next: () => {
            this.snackBar.open('Question updated successfully', 'Close', { duration: 3000 });
            this.resetForm();
            this.loadQuestions();
          },
          error: (error) => {
            console.error('Error updating question:', error);
            this.snackBar.open('Error updating question', 'Close', { duration: 3000 });
          }
        });

      this.subscriptions.add(updateSub);
    } else {
      // Add new question
      const addSub = this.firebaseService
        .addQuestion(this.selectedCategory, questionData)
        .subscribe({
          next: () => {
            this.snackBar.open('Question added successfully', 'Close', { duration: 3000 });
            this.resetForm();
            this.loadQuestions();
          },
          error: (error) => {
            console.error('Error adding question:', error);
            this.snackBar.open('Error adding question', 'Close', { duration: 3000 });
          }
        });

      this.subscriptions.add(addSub);
    }
  }

  // Sample questions for bulk import
  getSampleQuestions(): any[] {
    const sampleQuestions = {
      'ms-word': [
        {
          question: 'Which keyboard shortcut is used to save a document in Microsoft Word?',
          options: ['Ctrl+S', 'Ctrl+A', 'Ctrl+C', 'Ctrl+V'],
          correctAnswer: '0'
        },
        {
          question: 'What is the default font in Microsoft Word 2019?',
          options: ['Times New Roman', 'Arial', 'Calibri', 'Helvetica'],
          correctAnswer: '2'
        }
      ],
      'ms-excel': [
        {
          question: 'Which function is used to sum a range of cells in Excel?',
          options: ['TOTAL()', 'ADD()', 'SUM()', 'CALCULATE()'],
          correctAnswer: '2'
        },
        {
          question: 'What does the formula =VLOOKUP() do in Excel?',
          options: ['Vertical lookup', 'Variable lookup', 'Value lookup', 'Visual lookup'],
          correctAnswer: '0'
        }
      ],
      'ms-powerpoint': [
        {
          question: 'Which view is best for adding content to slides in PowerPoint?',
          options: ['Slide Sorter View', 'Normal View', 'Reading View', 'Notes Page View'],
          correctAnswer: '1'
        },
        {
          question: 'What is the keyboard shortcut to start a slideshow from the beginning?',
          options: ['F4', 'F5', 'F6', 'F7'],
          correctAnswer: '1'
        }
      ]
    };

    return sampleQuestions[this.selectedCategory!] || [];
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
    this.cdr.markForCheck();
  }

  async addSampleQuestions(): Promise<void> {
    if (!this.selectedCategory) {
      this.snackBar.open('Please select a category first', 'Close', { duration: 3000 });
      return;
    }

    this.isLoadingBulk = true;
    this.bulkStatusMessages = [];
    this.cdr.markForCheck();
    
    const sampleQuestions = this.getSampleQuestions();
    
    for (const question of sampleQuestions) {
      try {
        await this.firebaseService.addQuestion(this.selectedCategory, question).toPromise();
        this.bulkStatusMessages.push({
          text: `Added: "${question.question.substring(0, 50)}..."`,
          success: true
        });
      } catch (error) {
        console.error('Error adding question:', error);
        this.bulkStatusMessages.push({
          text: `Failed: "${question.question.substring(0, 50)}..."`,
          success: false
        });
      }
    }

    // Add summary message at the top
    const successCount = this.bulkStatusMessages.filter(m => m.success).length;
    this.bulkStatusMessages.unshift({
      text: `Successfully added ${successCount}/${sampleQuestions.length} sample questions for ${this.getCategoryName(this.selectedCategory!)}.`,
      success: successCount === sampleQuestions.length
    });

    this.isLoadingBulk = false;
    this.cdr.markForCheck();
    this.loadQuestions();
  }

  async deleteAllQuestions(): Promise<void> {
    if (!this.selectedCategory) {
      this.snackBar.open('Please select a category first', 'Close', { duration: 3000 });
      return;
    }

    const confirmMessage = `Are you sure you want to delete ALL questions for ${this.getCategoryName(this.selectedCategory)}? This cannot be undone!`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.isLoadingBulk = true;
    this.bulkStatusMessages = [];
    this.cdr.markForCheck();

    try {
      for (const question of this.questions) {
        try {
          await this.firebaseService.deleteQuestion(this.selectedCategory, question.id.toString()).toPromise();
          this.bulkStatusMessages.push({
            text: `Deleted: "${question.question.substring(0, 50)}..."`,
            success: true
          });
        } catch (error) {
          console.error('Error deleting question:', error);
          this.bulkStatusMessages.push({
            text: `Failed to delete: "${question.question.substring(0, 50)}..."`,
            success: false
          });
        }
      }

      // Add summary message at the top
      const successCount = this.bulkStatusMessages.filter(m => m.success).length;
      this.bulkStatusMessages.unshift({
        text: `Successfully deleted ${successCount}/${this.questions.length} questions from ${this.getCategoryName(this.selectedCategory!)}.`,
        success: successCount === this.questions.length
      });

    } catch (error) {
      console.error('Error in bulk delete:', error);
      this.bulkStatusMessages.push({
        text: 'Bulk delete operation failed',
        success: false
      });
    }

    this.isLoadingBulk = false;
    this.cdr.markForCheck();
    this.loadQuestions();
  }

  // Helper methods for template
  getOptionLabel(index: number): string {
    return ['A', 'B', 'C', 'D'][index] || '';
  }

  getOptionPlaceholder(index: number): string {
    const examples = [
      'Enter option A...',
      'Enter option B...',
      'Enter option C...',
      'Enter option D...'
    ];
    return examples[index] || '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  clearCategoryQuestions(): void {
    this.deleteAllQuestions();
  }
}

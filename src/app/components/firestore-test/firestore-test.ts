import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { Question } from '../../types/quiz.types';

@Component({
  selector: 'app-firestore-test',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="test-container">
      <h2>Firestore Connection Test</h2>
      
      <div class="test-section">
        <h3>Connection Status</h3>
        <p [class]="connectionStatus === 'Connected' ? 'success' : 'error'">
          Status: {{ connectionStatus }}
        </p>
      </div>

      <div class="test-section">
        <h3>Test Operations</h3>
        <button (click)="testReadQuestions()" [disabled]="isLoading">
          Test Read Questions
        </button>
        <button (click)="testAddQuestion()" [disabled]="isLoading">
          Test Add Question
        </button>
        @if (isLoading) {
          <div class="loading">Testing...</div>
        }
      </div>

      @if (testResults.length > 0) {
        <div class="test-section">
          <h3>Test Results</h3>
          @for (result of testResults; track result.operation) {
            <div [class]="result.success ? 'success' : 'error'">
              <strong>{{ result.operation }}:</strong> {{ result.message }}
            </div>
          }
        </div>
      }

      @if (questions.length > 0) {
        <div class="test-section">
          <h3>Questions from Firestore ({{ questions.length }})</h3>
          @for (question of questions; track question.id) {
            <div class="question-item">
              <strong>{{ question.question }}</strong>
              <ul>
                @for (option of question.options; track $index; let i = $index) {
                  <li [class]="i.toString() === question.correctAnswer ? 'correct' : ''">
                    {{ option }}
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .test-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    .test-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .success {
      color: #28a745;
      font-weight: bold;
    }
    
    .error {
      color: #dc3545;
      font-weight: bold;
    }
    
    .loading {
      color: #007bff;
      font-style: italic;
      margin: 10px 0;
    }
    
    button {
      margin: 5px 10px 5px 0;
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    button:hover:not(:disabled) {
      background: #0056b3;
    }
    
    .question-item {
      margin: 10px 0;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .question-item .correct {
      background-color: #d4edda;
      font-weight: bold;
    }
    
    ul {
      margin: 5px 0;
    }
  `]
})
export class FirestoreTestComponent {
  private firebaseService = inject(FirebaseService);
  
  connectionStatus = 'Testing...';
  isLoading = false;
  testResults: Array<{operation: string, success: boolean, message: string}> = [];
  questions: Question[] = [];

  ngOnInit() {
    this.testConnection();
  }

  async testConnection() {
    try {
      // Simple connection test by attempting to get questions
      this.connectionStatus = 'Testing connection...';
      await this.firebaseService.getQuestions('ms-word').toPromise();
      this.connectionStatus = 'Connected';
    } catch (error: any) {
      this.connectionStatus = `Connection failed: ${error.message}`;
    }
  }

  async testReadQuestions() {
    this.isLoading = true;
    try {
      this.questions = await this.firebaseService.getQuestions('ms-word').toPromise() || [];
      this.testResults.push({
        operation: 'Read Questions',
        success: true,
        message: `Successfully retrieved ${this.questions.length} questions`
      });
    } catch (error: any) {
      this.testResults.push({
        operation: 'Read Questions',
        success: false,
        message: `Error: ${error.message}`
      });
    }
    this.isLoading = false;
  }

  async testAddQuestion() {
    this.isLoading = true;
    
    const testQuestion: Omit<Question, 'id'> = {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "1"
    };

    try {
      const docId = await this.firebaseService.addQuestion('ms-word', testQuestion).toPromise();
      this.testResults.push({
        operation: 'Add Question',
        success: true,
        message: `Successfully added question with ID: ${docId}`
      });
      
      // Refresh questions list
      await this.testReadQuestions();
    } catch (error: any) {
      this.testResults.push({
        operation: 'Add Question',
        success: false,
        message: `Error: ${error.message}`
      });
    }
    this.isLoading = false;
  }
}
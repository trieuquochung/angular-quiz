import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button routerLink="/home">
        <mat-icon>school</mat-icon>
      </button>
      <span>Online Quiz</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/home">Home</button>
      <button mat-button routerLink="/quiz">Start Quiz</button>
      <button mat-button routerLink="/admin">Admin</button>
    </mat-toolbar>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    main {
      min-height: calc(100vh - 64px);
      background-color: #fafafa;
    }
  `]
})
export class AppComponent {}

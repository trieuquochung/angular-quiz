import { Component, inject, ChangeDetectionStrategy, OnInit, ElementRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseService, QuizCategory } from '../../services/firebase.service';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private firebaseService = inject(FirebaseService);
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  categories = this.firebaseService.categories;

  ngOnInit() {
    // Add initial loading class (only in browser)
    if (this.isBrowser) {
      setTimeout(() => {
        this.elementRef.nativeElement.classList.add('loaded');
      }, 100);
    }
  }

  startQuiz(category: QuizCategory, event?: Event) {
    // Add click animation (only in browser)
    if (this.isBrowser && event) {
      const clickedCard = event.target as HTMLElement;
      const card = clickedCard.closest('.category-card');
      
      if (card) {
        card.classList.add('clicked');
        setTimeout(() => {
          card.classList.remove('clicked');
        }, 200);
      }
    }

    // Navigate to quiz with category parameter
    const delay = this.isBrowser ? 300 : 0;
    setTimeout(() => {
      this.router.navigate(['/quiz'], { queryParams: { category } });
    }, delay);
  }
}
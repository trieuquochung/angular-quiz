import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'quiz',
    loadComponent: () => import('./components/quiz/quiz').then(m => m.QuizComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./components/results/results').then(m => m.ResultsComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin').then(m => m.AdminComponent)
  },
  {
    path: 'test-firestore',
    loadComponent: () => import('./components/firestore-test/firestore-test').then(m => m.FirestoreTestComponent)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

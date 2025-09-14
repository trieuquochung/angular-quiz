import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
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
    path: '**',
    redirectTo: '/home'
  }
];

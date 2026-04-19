import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'CinemaFlow - Dashboard'
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movie-list/movie-list.component').then(m => m.MovieListComponent),
    title: 'CinemaFlow - Movies'
  },
  {
    path: 'movies/genre/:genre',
    loadComponent: () => import('./pages/movie-list/movie-list.component').then(m => m.MovieListComponent),
    title: 'CinemaFlow - Movies by Genre'
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./pages/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    title: 'CinemaFlow - Movie Detail'
  },
  {
    path: 'directors',
    loadComponent: () => import('./pages/director-list/director-list.component').then(m => m.DirectorListComponent),
    title: 'CinemaFlow - Directors'
  },
  {
    path: 'directors/:id',
    loadComponent: () => import('./pages/director-detail/director-detail.component').then(m => m.DirectorDetailComponent),
    title: 'CinemaFlow - Director Detail'
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/movie-add/movie-add.component').then(m => m.MovieAddComponent),
    canActivate: [authGuard],
    title: 'CinemaFlow - Add Movie'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'CinemaFlow - About'
  },
  { path: '**', component: NotFoundComponent, title: 'CinemaFlow - Not Found' }
];

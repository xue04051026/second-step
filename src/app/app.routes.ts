import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    title: 'CinemaFlow - 仪表盘'
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movie-list/movie-list.component')
      .then(m => m.MovieListComponent),
    title: 'CinemaFlow - 电影列表'
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./pages/movie-detail/movie-detail.component')
      .then(m => m.MovieDetailComponent),
    title: 'CinemaFlow - 电影详情',
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadComponent: () => import('./components/movie-info/movie-info.component').then(m => m.MovieInfoComponent) },
      { path: 'cast', loadComponent: () => import('./components/movie-cast/movie-cast.component').then(m => m.MovieCastComponent) },
    ]
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/movie-add/movie-add.component')
      .then(m => m.MovieAddComponent),
    title: 'CinemaFlow - 添加电影'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component')
      .then(m => m.AboutComponent),
    title: 'CinemaFlow - 关于'
  },
  { path: '**', redirectTo: '/dashboard' } // 通配符路由（404 处理）
];
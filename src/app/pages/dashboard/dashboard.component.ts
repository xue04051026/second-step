import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MovieService } from '../../services/movie.service';
import { MovieStatsComponent } from '../../components/movie-stats/movie-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MovieStatsComponent
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="page-title">
        欢迎使用 CinemaFlow
      </h1>
      <!-- 统计概览 -->
      <app-movie-stats></app-movie-stats>
      <!-- 快捷操作 -->
      <mat-card class="quick-actions">
        <mat-card-header>
          <mat-card-title>快捷操作</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="action-buttons">
            <a class="action-btn primary-btn" routerLink="/movies">
              查看电影列表
            </a>
            <a class="action-btn accent-btn" routerLink="/add">
              添加新电影
            </a>
          </div>
        </mat-card-content>
      </mat-card>
      <!-- 最近添加的电影 -->
      <mat-card class="recent-movies">
        <mat-card-header>
          <mat-card-title>最近添加</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="movie-list">
            <div *ngFor="let movie of recentMovies" class="movie-item">
              <a [routerLink]="['/movies', movie.id]">{{ movie.title }}</a>
              <span class="movie-rating">{{ movie.rating }}分</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-title {
      margin-bottom: 32px;
      font-size: 2rem;
      font-weight: 500;
    }
    .quick-actions {
      margin-bottom: 24px;
    }
    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .action-btn {
      padding: 12px 24px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    .primary-btn {
      background-color: #1976d2;
      color: white;
    }
    .primary-btn:hover {
      background-color: #1565c0;
    }
    .accent-btn {
      background-color: #ff4081;
      color: white;
    }
    .accent-btn:hover {
      background-color: #f50057;
    }
    .recent-movies {
      margin-bottom: 24px;
    }
    .movie-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .movie-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    .movie-item:hover {
      background-color: #f5f5f5;
    }
    .movie-item a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }
    .movie-item a:hover {
      text-decoration: underline;
    }
    .movie-rating {
      color: #666;
      font-weight: 500;
    }
  `]
})
export class DashboardComponent {
  private movieService = inject(MovieService);
  
  private movies = this.movieService.getMovies();

  get recentMovies() {
    return this.movies.slice(-3).reverse();
  }
}
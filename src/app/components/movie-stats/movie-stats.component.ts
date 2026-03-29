import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatGridListModule],
  template: `
    <mat-card class="stats-card">
      <mat-card-header>
        <mat-card-title>电影统计</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-grid-list cols="4" rowHeight="100px">
          <mat-grid-tile>
            <mat-card class="stat-item">
              <mat-card-content>
                <div class="stat-number">{{ totalMovies }}</div>
                <div class="stat-label">总电影数</div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          <mat-grid-tile>
            <mat-card class="stat-item">
              <mat-card-content>
                <div class="stat-number">{{ watchedMovies }}</div>
                <div class="stat-label">已观影</div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          <mat-grid-tile>
            <mat-card class="stat-item">
              <mat-card-content>
                <div class="stat-number">{{ averageRating.toFixed(1) }}</div>
                <div class="stat-label">平均评分</div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
          <mat-grid-tile>
            <mat-card class="stat-item">
              <mat-card-content>
                <div class="stat-number">{{ unwatchedMovies }}</div>
                <div class="stat-label">未观影</div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stats-card {
      margin-bottom: 24px;
    }
    .stat-item {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }
    .stat-label {
      font-size: 0.9rem;
      color: #666;
      margin-top: 4px;
    }
  `]
})
export class MovieStatsComponent {
  private movieService = inject(MovieService);
  
  private movies = this.movieService.getMovies();

  get totalMovies(): number {
    return this.movies.length;
  }

  get watchedMovies(): number {
    return this.movies.filter(movie => movie.isWatched).length;
  }

  get unwatchedMovies(): number {
    return this.totalMovies - this.watchedMovies;
  }

  get averageRating(): number {
    if (this.movies.length === 0) return 0;
    const sum = this.movies.reduce((acc, movie) => acc + movie.rating, 0);
    return sum / this.movies.length;
  }
}
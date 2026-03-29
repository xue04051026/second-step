import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Movie } from '../../models/movie';
import { RatingLevelPipe } from '../../pipes/rating-level.pipe';

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, RatingLevelPipe],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>基本信息</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="info-grid">
          <div class="info-item">
            <mat-icon>person</mat-icon>
            <span class="label">导演：</span>
            <span>{{ movie?.director }}</span>
          </div>
          <div class="info-item">
            <mat-icon>calendar_today</mat-icon>
            <span class="label">上映日期：</span>
            <span>{{ movie?.releaseDate | date:'yyyy年MM月dd日' }}</span>
          </div>
          <div class="info-item">
            <mat-icon>star</mat-icon>
            <span class="label">评分：</span>
            <span class="rating-score">{{ movie?.rating }}</span>
            <span class="rating-level">({{ (movie?.rating || 0) | ratingLevel }})</span>
          </div>
          <div class="info-item">
            <mat-icon>visibility</mat-icon>
            <span class="label">状态：</span>
            <mat-chip-option [selected]="movie?.isWatched" color="primary">
              {{ movie?.isWatched ? '已观影' : '未观影' }}
            </mat-chip-option>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .label {
      font-weight: 500;
      min-width: 80px;
    }
    .rating-score {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1976d2;
    }
    .rating-level {
      color: #666;
      margin-left: 4px;
    }
  `]
})
export class MovieInfoComponent {
  @Input() movie?: Movie;
}
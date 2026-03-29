import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-add',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  template: `
    <div class="page-container">
      <h1>添加新电影</h1>
      <mat-card>
        <mat-card-content>
          <form #movieForm="ngForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>电影名称</mat-label>
              <input matInput [(ngModel)]="newMovie.title" name="title" required>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>导演</mat-label>
              <input matInput [(ngModel)]="newMovie.director" name="director" required>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>上映日期</mat-label>
              <input matInput [matDatepicker]="picker"
                [(ngModel)]="newMovie.releaseDate" name="releaseDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
            <div class="form-field rating-field">
              <label class="rating-label">评分</label>
              <div class="rating-container">
                <mat-slider min="0" max="10" step="0.1" class="rating-slider">
                  <input matSliderThumb [(ngModel)]="newMovie.rating" name="rating">
                </mat-slider>
                <span class="rating-value">{{ newMovie.rating?.toFixed(1) }}</span>
              </div>
              <div class="rating-scale">
                <span>0</span>
                <span>2</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
                <span>10</span>
              </div>
            </div>
            <mat-slide-toggle [(ngModel)]="newMovie.isWatched" name="isWatched" color="primary">
              已观影
            </mat-slide-toggle>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>海报URL</mat-label>
              <input matInput [(ngModel)]="newMovie.posterUrl" name="posterUrl">
            </mat-form-field>
            <div class="form-actions">
              <button mat-button type="button" routerLink="/movies">
                取消
              </button>
              <button mat-raised-button color="primary" type="submit"
                [disabled]="!movieForm.form.valid">
                保存
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .form-field {
      margin-bottom: 16px;
    }
    .form-field label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .rating-field {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .rating-label {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }
    .rating-container {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }
    .rating-slider {
      flex: 1;
    }
    .rating-slider ::ng-deep .mat-slider-track-fill {
      background-color: #1976d2 !important;
    }
    .rating-slider ::ng-deep .mat-slider-thumb {
      background-color: #1976d2 !important;
      width: 24px;
      height: 24px;
    }
    .rating-slider ::ng-deep .mat-slider-thumb-label {
      background-color: #1976d2 !important;
    }
    .rating-value {
      font-size: 24px;
      font-weight: 700;
      color: #1976d2;
      min-width: 60px;
      text-align: center;
      background-color: white;
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .rating-scale {
      display: flex;
      justify-content: space-between;
      padding: 0 8px;
      color: #999;
      font-size: 12px;
      margin-top: 8px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
  `]
})
export class MovieAddComponent {
  private movieService = inject(MovieService);
  private router = inject(Router);

  newMovie: Partial<Movie> = {
    title: '',
    director: '',
    releaseDate: new Date(),
    rating: 7.0,
    isWatched: false,
    posterUrl: ''
  };

  onSubmit(): void {
    this.movieService.addMovie(this.newMovie as Omit<Movie, 'id'>);
    this.router.navigate(['/movies']); // 添加成功后跳转到列表页
  }
}
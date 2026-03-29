import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { RatingLevelPipe } from '../../pipes/rating-level.pipe';
import { MovieInfoComponent } from '../../components/movie-info/movie-info.component';
import { MovieCastComponent } from '../../components/movie-cast/movie-cast.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    RatingLevelPipe,
    MovieInfoComponent,
    MovieCastComponent
  ],
  template: `
    <div class="page-container">
      <!-- 返回按钮 -->
      <button class="back-btn" (click)="goBack()">
        返回
      </button>
      <div *ngIf="movie; else notFound">
        <mat-card class="movie-detail-card">
          <div class="movie-header">
            <img [src]="movie.posterUrl || '/picture/' + movie.id + '.jpg'"
              [alt]="movie.title"
              class="movie-poster">
            <div class="movie-info">
              <h1>{{ movie.title }}</h1>
              <p class="director">
                导演：{{ movie.director }}
              </p>
              <p class="release-date">
                上映日期：{{ movie.releaseDate | date:'yyyy年MM月dd日' }}
              </p>
              <div class="rating-section">
                <span class="rating-score">{{ movie.rating }}</span>
                <span class="rating-level">{{ movie.rating | ratingLevel }}</span>
                <span class="status-badge" [class.watched]="movie.isWatched">
                  {{ movie.isWatched ? '已观影' : '未观影' }}
                </span>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <a class="action-btn edit-btn" routerLink="/movies">
              编辑
            </a>
            <button class="action-btn delete-btn" (click)="deleteMovie()">
              删除
            </button>
          </div>
        </mat-card>

        <!-- 子路由导航 -->
        <mat-card class="tabs-card">
          <mat-card-content>
            <mat-tab-group>
              <mat-tab label="基本信息">
                <ng-template matTabContent>
                  <app-movie-info [movie]="movie"></app-movie-info>
                </ng-template>
              </mat-tab>
              <mat-tab label="演员表">
                <ng-template matTabContent>
                  <app-movie-cast [movie]="movie"></app-movie-cast>
                </ng-template>
              </mat-tab>
            </mat-tab-group>
          </mat-card-content>
        </mat-card>

        <!-- 上一部/下一部导航 -->
        <div class="navigation-buttons">
          <button class="nav-btn prev-btn"
            *ngIf="prevMovieId"
            [routerLink]="['/movies', prevMovieId]">
            上一部
          </button>
          <span class="spacer"></span>
          <button class="nav-btn next-btn"
            *ngIf="nextMovieId"
            [routerLink]="['/movies', nextMovieId]">
            下一部
          </button>
        </div>
      </div>
      <ng-template #notFound>
        <mat-card class="not-found">
          <mat-card-content>
            <h2>电影未找到</h2>
            <p>该电影可能已被删除或ID不正确</p>
            <a class="back-to-list-btn" routerLink="/movies">
              返回电影列表
            </a>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .back-btn {
      background-color: #666;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .back-btn:hover {
      background-color: #555;
    }
    .movie-detail-card {
      margin-top: 24px;
    }
    .movie-header {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }
    .movie-poster {
      width: 200px;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
    }
    .movie-info {
      flex: 1;
    }
    .movie-info h1 {
      margin: 0 0 16px 0;
      font-size: 2rem;
    }
    .director, .release-date {
      margin-bottom: 12px;
      color: #666;
    }
    .rating-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
    }
    .rating-score {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
    }
    .rating-level {
      color: #666;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      background-color: #e0e0e0;
    }
    .status-badge.watched {
      background-color: #4caf50;
      color: white;
    }
    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
    .action-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
    }
    .edit-btn {
      background-color: #1976d2;
      color: white;
    }
    .edit-btn:hover {
      background-color: #1565c0;
    }
    .delete-btn {
      background-color: #d32f2f;
      color: white;
    }
    .delete-btn:hover {
      background-color: #c62828;
    }
    .tabs-card {
      margin-top: 24px;
    }
    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
    }
    .nav-btn {
      padding: 8px 16px;
      border: 1px solid #1976d2;
      border-radius: 4px;
      background-color: white;
      color: #1976d2;
      cursor: pointer;
      font-size: 14px;
    }
    .nav-btn:hover {
      background-color: #1976d2;
      color: white;
    }
    .spacer {
      flex: 1;
    }
    .not-found {
      text-align: center;
      margin-top: 48px;
    }
    .back-to-list-btn {
      background-color: #1976d2;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
    }
    .back-to-list-btn:hover {
      background-color: #1565c0;
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private location = inject(Location);

  movie?: Movie;
  prevMovieId?: number;
  nextMovieId?: number;

  ngOnInit(): void {
    // 从路由参数中获取电影ID
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loadMovie(id);
    });
  }

  private loadMovie(id: number): void {
    this.movie = this.movieService.getMovie(id);
    if (this.movie) {
      // 计算上一部和下一部的ID
      const movies = this.movieService.getMovies();
      const currentIndex = movies.findIndex(m => m.id === id);
      this.prevMovieId = currentIndex > 0 ? movies[currentIndex - 1].id : undefined;
      this.nextMovieId = currentIndex < movies.length - 1 ? movies[currentIndex + 1].id : undefined;
    }
  }

  goBack(): void {
    this.location.back(); // 浏览器后退
  }

  deleteMovie(): void {
    if (this.movie && confirm('确定要删除这部电影吗？')) {
      this.movieService.deleteMovie(this.movie.id);
      this.router.navigate(['/movies']); // 删除后跳转到列表页
    }
  }
}
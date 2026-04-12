import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Movie } from '../../models/movie';
import { MessageService } from '../../services/message.service';
import { MovieStateService } from '../../services/movie-state.service';
import { RatingLevelPipe } from '../../pipes/rating-level.pipe';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingLevelPipe],
  template: `
    <div class="detail-shell">
      <button class="back-link" type="button" (click)="goBack()">返回上一页</button>

      <ng-container *ngIf="viewModel$ | async as vm; else loadingState">
      <section class="detail-panel" *ngIf="vm.movie as movie; else notFound">
        <div class="poster-column">
          <img
            [src]="movie.posterUrl || defaultPoster"
            [alt]="movie.title"
            (error)="handlePosterError($event)"
          />
          <div class="poster-caption">
            <span>{{ movie.genre }}</span>
            <strong>{{ movie.rating }}</strong>
          </div>
        </div>

        <div class="content-column">
          <p class="eyebrow">Featured Detail</p>
          <h1>{{ movie.title }}</h1>
          <p class="tagline">{{ movie.tagline }}</p>

          <div class="badge-row">
            <span class="badge">{{ movie.rating | ratingLevel }}</span>
            <span class="badge" [class.badge-active]="movie.isWatched">
              {{ movie.isWatched ? '已观看' : '待观看' }}
            </span>
          </div>

          <p class="summary">{{ movie.summary }}</p>

          <div class="info-grid">
            <div>
              <span>导演</span>
              <strong>{{ movie.director }}</strong>
            </div>
            <div>
              <span>上映日期</span>
              <strong>{{ movie.releaseDate | date: 'yyyy 年 MM 月 dd 日' }}</strong>
            </div>
            <div>
              <span>片长</span>
              <strong>{{ movie.runtime || '--' }} 分钟</strong>
            </div>
            <div>
              <span>国家 / 地区</span>
              <strong>{{ movie.country || '--' }}</strong>
            </div>
            <div>
              <span>语言</span>
              <strong>{{ movie.language || '--' }}</strong>
            </div>
            <div>
              <span>类型</span>
              <strong>{{ movie.genre || '--' }}</strong>
            </div>
          </div>

          <div class="action-row">
            <a routerLink="/movies">返回列表</a>
            <button type="button" class="delete-btn" (click)="deleteMovie(movie)">删除电影</button>
          </div>

          <div class="pager-row">
            <a *ngIf="vm.prevMovieId" [routerLink]="['/movies', vm.prevMovieId]">上一部</a>
            <span *ngIf="!vm.prevMovieId"></span>
            <a *ngIf="vm.nextMovieId" [routerLink]="['/movies', vm.nextMovieId]">下一部</a>
          </div>
        </div>
      </section>
      </ng-container>

      <ng-template #notFound>
        <section class="detail-panel empty-panel">
          <h2>没有找到这部电影</h2>
          <p>它可能已经被删除，或者当前链接中的电影编号不存在。</p>
          <a routerLink="/movies">返回电影列表</a>
        </section>
      </ng-template>

      <ng-template #loadingState>
        <section class="detail-panel empty-panel">
          <h2>正在加载电影详情</h2>
          <p>服务正在读取路由参数与电影状态。</p>
        </section>
      </ng-template>
    </div>
  `,
  styles: [`
    .detail-shell {
      max-width: 1280px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1rem;
    }

    .back-link,
    .action-row a,
    .action-row button,
    .pager-row a,
    .empty-panel a {
      min-height: 46px;
      padding: 0 1.2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
      color: #fff8e7;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s ease, background 0.25s ease;
    }

    .back-link:hover,
    .action-row a:hover,
    .action-row button:hover,
    .pager-row a:hover,
    .empty-panel a:hover {
      transform: translateY(-2px);
    }

    .detail-panel {
      display: grid;
      grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
      gap: 1.4rem;
      padding: clamp(1.2rem, 3vw, 2rem);
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(9, 11, 20, 0.9);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(14px);
    }

    .poster-column {
      position: relative;
      overflow: hidden;
      border-radius: 26px;
      background: #111;
      min-height: 100%;
    }

    .poster-column img {
      width: 100%;
      height: 100%;
      min-height: 580px;
      object-fit: cover;
      display: block;
    }

    .poster-caption {
      position: absolute;
      inset: auto 1rem 1rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: end;
      padding: 0.9rem 1rem;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.76));
      color: #fff;
      backdrop-filter: blur(8px);
    }

    .poster-caption strong {
      font-size: 2rem;
      font-family: 'Barlow Condensed', sans-serif;
      color: #f6d878;
    }

    .content-column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;
    }

    .eyebrow,
    .tagline,
    .summary,
    .info-grid span {
      color: rgba(255, 248, 225, 0.74);
    }

    .eyebrow {
      margin: 0;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-size: 0.76rem;
    }

    .content-column h1,
    .empty-panel h2 {
      margin: 0;
      color: #fff8e7;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.8rem, 5vw, 4.6rem);
      line-height: 0.95;
    }

    .tagline {
      margin: 0;
      font-size: 1.05rem;
      letter-spacing: 0.02em;
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .badge {
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: #fff8e7;
    }

    .badge-active {
      background: rgba(96, 180, 124, 0.18);
      color: #baf2cb;
    }

    .summary {
      margin: 0;
      line-height: 1.9;
      font-size: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
    }

    .info-grid div {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 1rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .info-grid strong {
      color: #fff;
      font-size: 1rem;
    }

    .action-row,
    .pager-row {
      display: flex;
      gap: 0.9rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .delete-btn {
      background: rgba(195, 58, 58, 0.2) !important;
    }

    .pager-row {
      justify-content: space-between;
      margin-top: 0.5rem;
    }

    .empty-panel {
      text-align: center;
      grid-template-columns: 1fr;
      justify-items: center;
      gap: 1rem;
      padding: 3rem 1.5rem;
    }

    .empty-panel p {
      margin: 0;
      color: rgba(255, 248, 225, 0.74);
    }

    @media (max-width: 980px) {
      .detail-panel {
        grid-template-columns: 1fr;
      }

      .poster-column img {
        min-height: 420px;
        max-height: 640px;
      }
    }

    @media (max-width: 640px) {
      .detail-shell {
        padding: 1rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movieStateService = inject(MovieStateService);
  private readonly messageService = inject(MessageService);
  private readonly location = inject(Location);

  readonly defaultPoster = '/assets/default-poster.jpg';

  readonly viewModel$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));

      return this.movieStateService.movies$.pipe(
        map(movies => {
          const currentIndex = movies.findIndex(movie => movie.id === id);
          const movie = currentIndex >= 0 ? movies[currentIndex] : undefined;

          return {
            movie,
            prevMovieId: currentIndex > 0 ? movies[currentIndex - 1].id : undefined,
            nextMovieId: currentIndex >= 0 && currentIndex < movies.length - 1
              ? movies[currentIndex + 1].id
              : undefined
          };
        })
      );
    }),
    tap(viewModel => {
      if (viewModel.movie) {
        this.movieStateService.markAsVisited(viewModel.movie.id);
      }
    }),
    catchError(error => {
      this.messageService.add(`详情页加载失败: ${error instanceof Error ? error.message : String(error)}`);
      return of({ movie: undefined, prevMovieId: undefined, nextMovieId: undefined });
    })
  );

  goBack(): void {
    this.location.back();
  }

  handlePosterError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultPoster;
  }

  deleteMovie(movie: Movie): void {
    if (!confirm('确定要删除这部电影吗？')) {
      return;
    }

    this.movieStateService.delete(movie.id).subscribe({
      next: () => this.router.navigate(['/movies'])
    });
  }
}

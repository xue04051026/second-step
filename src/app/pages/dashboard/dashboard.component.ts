import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MovieStateService } from '../../services/movie-state.service';
import { MovieStatsComponent } from '../../components/movie-stats/movie-stats.component';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieStatsComponent],
  template: `
    <ng-container *ngIf="viewModel$ | async as vm; else loadingState">
      <div class="dashboard-shell">
      <section class="hero-stage" *ngIf="vm.heroMovie as heroMovie">
        <div class="hero-backdrop">
          <img [src]="dashboardBackdrop" alt="Dashboard backdrop" (error)="handlePosterError($event)" />
        </div>

        <div class="hero-content">
          <div class="hero-copy">
            <p class="eyebrow">Dashboard Premiere</p>
            <h1>你的片单，不只是管理页，也可以像电影节主视觉一样展开。</h1>
            <p class="hero-text">
              从热门推荐、观影进度到近期入库影片，CinemaFlow 现在更像一张会呼吸的电影首页。
            </p>

            <div class="hero-actions">
              <a class="primary-action" [routerLink]="['/movies', heroMovie.id]">查看本周推荐</a>
              <a class="ghost-action" routerLink="/movies">浏览全部片单</a>
            </div>
          </div>

          <article class="hero-feature">
            <span class="feature-label">本周主推</span>
            <h2>{{ heroMovie.title }}</h2>
            <p>{{ heroMovie.tagline }}</p>
            <div class="feature-meta">
              <span>{{ heroMovie.genre }}</span>
              <strong>{{ heroMovie.rating }}</strong>
            </div>
          </article>
        </div>
      </section>

      <app-movie-stats></app-movie-stats>

      <section class="dashboard-grid">
        <article class="panel spotlight-panel">
          <div class="panel-heading">
            <div>
              <p class="panel-kicker">Fresh Additions</p>
              <h3>近期入库</h3>
            </div>
            <a routerLink="/movies">全部电影</a>
          </div>

          <div class="recent-grid">
            <a
              class="recent-card"
              *ngFor="let movie of vm.recentMovies"
              [routerLink]="['/movies', movie.id]"
            >
              <div class="recent-poster">
                <img [src]="movie.posterUrl || defaultPoster" [alt]="movie.title" (error)="handlePosterError($event)" />
              </div>
              <div class="recent-info">
                <h4>{{ movie.title }}</h4>
                <p>{{ movie.director }}</p>
                <span>{{ movie.releaseDate | date: 'yyyy' }} · {{ movie.rating }} 分</span>
              </div>
            </a>
          </div>
        </article>

        <article class="panel side-panel">
          <div class="panel-heading">
            <div>
              <p class="panel-kicker">Quick Actions</p>
              <h3>快捷入口</h3>
            </div>
          </div>

          <div class="action-stack">
            <a class="action-tile" routerLink="/add">
              <strong>新增电影</strong>
              <span>把新海报和电影信息加入片单</span>
            </a>
            <a class="action-tile" routerLink="/movies?status=unwatched">
              <strong>待看片单</strong>
              <span>继续追踪还没来得及看的电影</span>
            </a>
            <a class="action-tile" routerLink="/movies?sortBy=rating">
              <strong>高分精选</strong>
              <span>快速浏览片库里的高口碑作品</span>
            </a>
          </div>

          <div class="marquee-card" *ngIf="vm.heroMovie as marqueeMovie">
            <span>放映提示</span>
            <strong>{{ marqueeMovie.title }}</strong>
            <p>{{ marqueeMovie.summary }}</p>
          </div>
        </article>
      </section>
      </div>
    </ng-container>

    <ng-template #loadingState>
      <div class="dashboard-shell">
        <section class="panel loading-panel">
          <h2>正在加载电影状态中心</h2>
          <p>服务正在准备片单数据，请稍候。</p>
        </section>
      </div>
    </ng-template>
  `,
  styles: [`
    .dashboard-shell {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1.5rem;
    }

    .hero-stage,
    .panel {
      position: relative;
      overflow: hidden;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(16px);
    }

    .hero-stage {
      min-height: 560px;
    }

    .hero-backdrop {
      position: absolute;
      inset: 0;
    }

    .hero-backdrop img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(0.9) brightness(0.35);
      transform: scale(1.06);
    }

    .hero-stage::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 78% 25%, rgba(212, 175, 55, 0.35), transparent 24%),
        linear-gradient(90deg, rgba(5, 7, 12, 0.92) 0%, rgba(5, 7, 12, 0.58) 55%, rgba(5, 7, 12, 0.86) 100%);
    }

    .hero-content {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.85fr);
      gap: 1.3rem;
      align-items: end;
      min-height: 560px;
      padding: clamp(1.4rem, 4vw, 3rem);
    }

    .eyebrow,
    .hero-text,
    .hero-feature p,
    .panel-kicker,
    .recent-info p,
    .recent-info span,
    .action-tile span,
    .marquee-card span,
    .marquee-card p {
      color: rgba(255, 248, 225, 0.74);
    }

    .eyebrow,
    .panel-kicker {
      margin: 0 0 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.24em;
      font-size: 0.78rem;
    }

    .hero-copy h1,
    .hero-feature h2,
    .panel-heading h3,
    .recent-info h4 {
      margin: 0;
      color: #fff8e7;
      font-family: 'Cormorant Garamond', serif;
    }

    .hero-copy h1 {
      font-size: clamp(3rem, 5vw, 5rem);
      line-height: 0.95;
      max-width: 11ch;
    }

    .hero-text {
      max-width: 44rem;
      margin: 1rem 0 0;
      line-height: 1.85;
      font-size: 1rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      margin-top: 1.5rem;
    }

    .primary-action,
    .ghost-action,
    .panel-heading a,
    .action-tile,
    .recent-card {
      text-decoration: none;
      transition: transform 0.25s ease, background 0.25s ease;
    }

    .primary-action,
    .panel-heading a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 0 1.2rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      font-weight: 700;
    }

    .ghost-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 0 1.2rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.05);
      color: #fff8e7;
    }

    .primary-action:hover,
    .ghost-action:hover,
    .recent-card:hover,
    .action-tile:hover {
      transform: translateY(-2px);
    }

    .hero-feature {
      padding: 1.35rem;
      border-radius: 26px;
      background:
        linear-gradient(180deg, rgba(212, 175, 55, 0.18), rgba(255, 255, 255, 0.04)),
        rgba(10, 12, 20, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
    }

    .feature-label {
      display: inline-flex;
      width: fit-content;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.1);
      color: #fff8e7;
      margin-bottom: 1rem;
    }

    .hero-feature h2 {
      font-size: clamp(2rem, 4vw, 3rem);
    }

    .feature-meta {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
      margin-top: 1.2rem;
      color: #fff8e7;
    }

    .feature-meta strong {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 3rem;
      line-height: 1;
      color: #f6d878;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.8fr);
      gap: 1.5rem;
    }

    .panel {
      padding: 1.4rem;
    }

    .loading-panel {
      color: #fff8e7;
      text-align: center;
    }

    .loading-panel p {
      color: rgba(255, 248, 225, 0.72);
    }

    .panel-heading {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: end;
      margin-bottom: 1.2rem;
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .recent-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 22px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.04);
    }

    .recent-poster {
      aspect-ratio: 2 / 3;
      overflow: hidden;
      background: #111;
    }

    .recent-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .recent-info {
      padding: 1rem;
      display: grid;
      gap: 0.35rem;
    }

    .recent-info p,
    .recent-info h4,
    .recent-info span {
      margin: 0;
    }

    .side-panel {
      display: grid;
      gap: 1rem;
      align-content: start;
    }

    .action-stack {
      display: grid;
      gap: 0.9rem;
    }

    .action-tile {
      display: grid;
      gap: 0.4rem;
      padding: 1rem 1.05rem;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.04);
      color: #fff8e7;
    }

    .marquee-card {
      padding: 1.1rem;
      border-radius: 22px;
      background:
        linear-gradient(180deg, rgba(212, 175, 55, 0.18), rgba(255, 255, 255, 0.03)),
        rgba(10, 12, 20, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .marquee-card strong {
      display: block;
      margin: 0.45rem 0 0.6rem;
      color: #fff8e7;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.9rem;
    }

    .marquee-card p {
      margin: 0;
      line-height: 1.75;
    }

    @media (max-width: 1080px) {
      .hero-content,
      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .recent-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 680px) {
      .dashboard-shell {
        padding: 1rem;
      }

      .recent-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  private readonly movieStateService = inject(MovieStateService);

  readonly defaultPoster = '/assets/default-poster.jpg';
  readonly dashboardBackdrop = 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg';

  readonly viewModel$ = this.movieStateService.movies$.pipe(
    map(movies => ({
      heroMovie: [...movies].sort((a, b) => b.rating - a.rating)[0] as Movie | undefined,
      recentMovies: movies.slice(-3).reverse()
    }))
  );

  handlePosterError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultPoster;
  }
}

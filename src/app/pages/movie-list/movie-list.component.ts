import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieStateService } from '../../services/movie-state.service';
import { RatingLevelPipe } from '../../pipes/rating-level.pipe';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RatingLevelPipe],
  template: `
    <ng-container *ngIf="viewModel$ | async as vm">
    <div class="page-shell">
      <section class="hero-panel">
        <div class="hero-copy">
          <p class="hero-kicker">Curated Selection</p>
          <h1>把片单做成一张有氛围的电影展映墙</h1>
          <p class="hero-text">
            保留原有筛选、删除和详情浏览能力，同时把页面重构成更像电影节选片现场的视觉体验。
          </p>
          <div class="hero-actions">
            <a class="primary-action" routerLink="/add">新增电影</a>
            <span class="hero-meta">{{ vm.filteredMovies.length }} / {{ vm.allMovies.length }} 部正在展映</span>
          </div>
        </div>

        <aside class="hero-highlight" *ngIf="vm.featuredMovie as featuredMovie">
          <div class="highlight-poster">
            <img
              [src]="featuredMovie.posterUrl || defaultPoster"
              [alt]="featuredMovie.title"
              (error)="handlePosterError($event)"
            />
          </div>
          <div class="highlight-content">
            <span class="highlight-label">本周推荐</span>
            <h2>{{ featuredMovie.title }}</h2>
            <p>{{ featuredMovie.tagline }}</p>
            <a [routerLink]="['/movies', featuredMovie.id]">查看详情</a>
          </div>
        </aside>
      </section>

      <section class="toolbar-panel">
        <label class="search-box">
          <span>搜索片名 / 导演</span>
          <input
            [(ngModel)]="searchTerm"
            (keyup.enter)="applyFilters()"
            placeholder="例如：诺兰、宫崎骏、肖申克"
          />
        </label>

        <div class="control-row">
          <label>
            <span>观影状态</span>
            <select [(ngModel)]="statusFilter" (change)="applyFilters()">
              <option value="">全部</option>
              <option value="watched">已观看</option>
              <option value="unwatched">未观看</option>
            </select>
          </label>

          <label>
            <span>评分区间</span>
            <select [(ngModel)]="ratingFilter" (change)="applyFilters()">
              <option value="">全部</option>
              <option value="masterpiece">9 分以上</option>
              <option value="high">8 - 8.9 分</option>
              <option value="medium">8 分以下</option>
            </select>
          </label>

          <label>
            <span>排序方式</span>
            <select [(ngModel)]="sortBy" (change)="applyFilters()">
              <option value="rating">按评分</option>
              <option value="releaseDate">按上映时间</option>
              <option value="title">按片名</option>
            </select>
          </label>

          <label>
            <span>排序顺序</span>
            <select [(ngModel)]="sortOrder" (change)="applyFilters()">
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </label>
        </div>

        <div class="chip-row" *ngIf="hasActiveFilters()">
          <button type="button" class="filter-chip" *ngIf="searchTerm" (click)="clearSearch()">
            搜索: {{ searchTerm }}
          </button>
          <button type="button" class="filter-chip" *ngIf="statusFilter" (click)="clearStatusFilter()">
            {{ statusFilter === 'watched' ? '已观看' : '未观看' }}
          </button>
          <button type="button" class="filter-chip" *ngIf="ratingFilter" (click)="clearRatingFilter()">
            {{ getRatingFilterLabel() }}
          </button>
          <button type="button" class="ghost-action" (click)="clearAllFilters()">清空筛选</button>
        </div>
      </section>

      <section class="spotlight-grid" *ngIf="vm.filteredMovies.length > 0">
        <article
          class="movie-card"
          *ngFor="let movie of vm.filteredMovies; let i = index"
          [style.animationDelay.ms]="i * 70"
        >
          <div class="poster-wrap">
            <img
              [src]="movie.posterUrl || defaultPoster"
              [alt]="movie.title"
              (error)="handlePosterError($event)"
            />
            <div class="poster-overlay">
              <span>{{ movie.genre }}</span>
              <strong>{{ movie.rating }}</strong>
            </div>
          </div>

          <div class="card-body">
            <div class="title-row">
              <div>
                <h3>{{ movie.title }}</h3>
                <p>{{ movie.director }}</p>
              </div>
              <span class="status-pill" [class.watched]="movie.isWatched">
                {{ movie.isWatched ? '已看' : '待看' }}
              </span>
            </div>

            <div class="meta-row">
              <span>{{ movie.releaseDate | date: 'yyyy' }}</span>
              <span *ngIf="movie.country">{{ movie.country }}</span>
              <span *ngIf="movie.runtime">{{ movie.runtime }} min</span>
            </div>

            <p class="summary">{{ movie.summary }}</p>

            <div class="footer-row">
              <div class="rating-stack">
                <strong>{{ movie.rating }}</strong>
                <span>{{ movie.rating | ratingLevel }}</span>
              </div>

              <div class="card-actions">
                <a [routerLink]="['/movies', movie.id]">详情</a>
                <button type="button" (click)="deleteMovie(movie.id)">删除</button>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section class="empty-state" *ngIf="vm.filteredMovies.length === 0">
        <h2>当前筛选下没有匹配电影</h2>
        <p>试试清空筛选，或者加入一部新的电影海报卡片。</p>
        <button type="button" class="primary-action inline-action" (click)="clearAllFilters()">恢复全部电影</button>
      </section>
    </div>
    </ng-container>
  `,
  styles: [`
    .page-shell {
      display: grid;
      gap: 1.5rem;
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-panel,
    .toolbar-panel,
    .empty-state {
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(16px);
    }

    .hero-panel {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
      gap: 1.2rem;
      padding: clamp(1.4rem, 3vw, 2.5rem);
      position: relative;
      overflow: hidden;
    }

    .hero-panel::after {
      content: '';
      position: absolute;
      inset: auto -10% -35% 35%;
      height: 260px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.35), transparent 70%);
      pointer-events: none;
    }

    .hero-kicker,
    .hero-text,
    .hero-meta,
    .hero-highlight p,
    label span,
    .meta-row,
    .summary {
      color: rgba(255, 248, 225, 0.74);
    }

    .hero-kicker {
      margin: 0 0 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.24em;
      font-size: 0.78rem;
    }

    .hero-copy h1,
    .hero-highlight h2,
    .empty-state h2 {
      margin: 0;
      color: #fff8e7;
      font-family: 'Cormorant Garamond', serif;
    }

    .hero-copy h1 {
      font-size: clamp(2.8rem, 5vw, 4.8rem);
      line-height: 0.95;
      max-width: 12ch;
    }

    .hero-text {
      max-width: 48rem;
      margin: 1rem 0 0;
      line-height: 1.8;
      font-size: 1rem;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }

    .primary-action,
    .ghost-action,
    .card-actions a,
    .card-actions button,
    .hero-highlight a {
      border: none;
      text-decoration: none;
      cursor: pointer;
      transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
    }

    .primary-action,
    .hero-highlight a,
    .card-actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.9rem 1.3rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #16130a;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
    }

    .primary-action:hover,
    .hero-highlight a:hover,
    .card-actions a:hover,
    .card-actions button:hover,
    .ghost-action:hover {
      transform: translateY(-2px);
    }

    .hero-highlight {
      align-self: stretch;
      min-height: 420px;
      overflow: hidden;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(180deg, rgba(212, 175, 55, 0.12), rgba(255, 255, 255, 0.02)),
        rgba(15, 17, 25, 0.92);
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.32);
      position: relative;
      z-index: 1;
    }

    .highlight-poster {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, #27211a, #111);
    }

    .highlight-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: saturate(0.95) brightness(0.46);
      transform: scale(1.04);
    }

    .highlight-content {
      position: absolute;
      inset: auto 0 0 0;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      padding: 1.4rem;
      background: linear-gradient(180deg, rgba(5, 7, 12, 0.05), rgba(5, 7, 12, 0.94));
      backdrop-filter: blur(6px);
    }

    .highlight-label {
      display: inline-flex;
      width: fit-content;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background: rgba(255, 248, 225, 0.14);
      color: #fff8e7;
      font-size: 0.78rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .toolbar-panel {
      padding: 1.4rem;
    }

    .search-box,
    .control-row label {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .search-box input,
    .control-row select {
      width: 100%;
      min-height: 52px;
      padding: 0 1rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      font-size: 0.96rem;
      outline: none;
    }

    .search-box input::placeholder {
      color: rgba(255, 255, 255, 0.38);
    }

    .control-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .filter-chip,
    .ghost-action {
      min-height: 40px;
      padding: 0 1rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: #fff8e7;
    }

    .ghost-action {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .spotlight-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .movie-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(10, 13, 22, 0.94);
      box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28);
      animation: riseIn 0.7s ease both;
    }

    .movie-card:hover .poster-wrap img {
      transform: scale(1.05);
    }

    .poster-wrap {
      position: relative;
      aspect-ratio: 2 / 3;
      overflow: hidden;
      background: linear-gradient(180deg, #27211a, #111);
    }

    .poster-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .poster-overlay {
      position: absolute;
      inset: auto 1rem 1rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: end;
      padding: 0.9rem 1rem;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(5, 6, 10, 0.08), rgba(5, 6, 10, 0.82));
      color: #fff;
      backdrop-filter: blur(8px);
    }

    .poster-overlay span {
      max-width: 70%;
      font-size: 0.86rem;
      line-height: 1.4;
    }

    .poster-overlay strong {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 2rem;
      color: #f6d878;
    }

    .card-body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 1rem;
      padding: 1.2rem;
    }

    .title-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: start;
    }

    .title-row h3 {
      margin: 0;
      color: #fff8e7;
      font-size: 1.45rem;
      font-family: 'Cormorant Garamond', serif;
    }

    .title-row p {
      margin: 0.35rem 0 0;
      color: rgba(255, 248, 225, 0.72);
    }

    .status-pill {
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: #ffe9b1;
      white-space: nowrap;
    }

    .status-pill.watched {
      background: rgba(96, 180, 124, 0.18);
      color: #baf2cb;
    }

    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
      font-size: 0.88rem;
    }

    .summary {
      margin: 0;
      line-height: 1.75;
      min-height: 5.3em;
    }

    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
      margin-top: auto;
    }

    .rating-stack {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .rating-stack strong {
      color: #fff;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 2.4rem;
      line-height: 1;
    }

    .rating-stack span {
      color: rgba(255, 248, 225, 0.72);
      font-size: 0.88rem;
    }

    .card-actions {
      display: flex;
      gap: 0.75rem;
    }

    .card-actions button {
      min-height: 44px;
      padding: 0 1rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: #fff8e7;
    }

    .empty-state {
      padding: 3rem 1.5rem;
      text-align: center;
    }

    .empty-state p {
      color: rgba(255, 248, 225, 0.74);
      margin: 1rem 0 1.4rem;
    }

    .inline-action {
      min-width: 180px;
    }

    @keyframes riseIn {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 1024px) {
      .hero-panel {
        grid-template-columns: 1fr;
      }

      .control-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .page-shell {
        padding: 1rem;
      }

      .control-row {
        grid-template-columns: 1fr;
      }

      .footer-row,
      .title-row {
        flex-direction: column;
        align-items: start;
      }

      .card-actions {
        width: 100%;
      }

      .card-actions a,
      .card-actions button {
        flex: 1;
      }
    }
  `]
})
export class MovieListComponent {
  private readonly movieStateService = inject(MovieStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly defaultPoster = '/assets/default-poster.jpg';

  searchTerm = '';
  statusFilter = '';
  ratingFilter = '';
  sortBy = 'rating';
  sortOrder = 'desc';

  readonly viewModel$ = combineLatest([
    this.movieStateService.movies$,
    this.route.queryParamMap
  ]).pipe(
    map(([movies, params]) => {
      this.searchTerm = params.get('search') || '';
      this.statusFilter = params.get('status') || '';
      this.ratingFilter = params.get('rating') || '';
      this.sortBy = params.get('sortBy') || 'rating';
      this.sortOrder = params.get('sortOrder') || 'desc';

      const filteredMovies = this.filterMovies(movies);

      return {
        allMovies: movies,
        filteredMovies,
        featuredMovie: [...filteredMovies].sort((a, b) => b.rating - a.rating)[0] as Movie | undefined
      };
    })
  );

  applyFilters(): void {
    const queryParams: Record<string, string> = {};
    if (this.searchTerm) queryParams['search'] = this.searchTerm;
    if (this.statusFilter) queryParams['status'] = this.statusFilter;
    if (this.ratingFilter) queryParams['rating'] = this.ratingFilter;
    if (this.sortBy !== 'rating') queryParams['sortBy'] = this.sortBy;
    if (this.sortOrder !== 'desc') queryParams['sortOrder'] = this.sortOrder;

    this.router.navigate(['/movies'], { queryParams });
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.statusFilter || this.ratingFilter);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  clearStatusFilter(): void {
    this.statusFilter = '';
    this.applyFilters();
  }

  clearRatingFilter(): void {
    this.ratingFilter = '';
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.ratingFilter = '';
    this.sortBy = 'rating';
    this.sortOrder = 'desc';
    this.router.navigate(['/movies']);
  }

  getRatingFilterLabel(): string {
    switch (this.ratingFilter) {
      case 'masterpiece':
        return '9 分以上';
      case 'high':
        return '8 - 8.9 分';
      case 'medium':
        return '8 分以下';
      default:
        return '';
    }
  }

  handlePosterError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultPoster;
  }

  deleteMovie(id: number): void {
    if (!confirm('确定要删除这部电影吗？')) {
      return;
    }

    this.movieStateService.delete(id).subscribe();
  }

  private filterMovies(movies: Movie[]): Movie[] {
    let result = [...movies];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(term) ||
        movie.director.toLowerCase().includes(term) ||
        (movie.genre || '').toLowerCase().includes(term)
      );
    }

    if (this.statusFilter) {
      const watched = this.statusFilter === 'watched';
      result = result.filter(movie => movie.isWatched === watched);
    }

    if (this.ratingFilter) {
      result = result.filter(movie => {
        if (this.ratingFilter === 'masterpiece') return movie.rating >= 9;
        if (this.ratingFilter === 'high') return movie.rating >= 8 && movie.rating < 9;
        if (this.ratingFilter === 'medium') return movie.rating < 8;
        return true;
      });
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (this.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title, 'zh-CN');
      } else if (this.sortBy === 'releaseDate') {
        comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      } else {
        comparison = a.rating - b.rating;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }
}

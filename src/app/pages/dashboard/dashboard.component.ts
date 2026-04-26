import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { DirectorService } from '../../services/director.service';
import { MovieStateService } from '../../services/movie-state.service';
import { MovieSearchComponent } from '../../components/movie-search/movie-search.component';
import { MovieStatsComponent } from '../../components/movie-stats/movie-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieStatsComponent, MovieSearchComponent],
  template: `
    <ng-container *ngIf="viewModel$ | async as vm; else loadingState">
      <section class="dashboard-shell">
        <header class="hero-stage" *ngIf="vm.heroMovie as heroMovie">
          <div>
            <p class="kicker">Dashboard</p>
            <h1>CinemaFlow</h1>
            <p class="copy">Quick entry for movies, genres, and directors.</p>
            <div class="hero-actions">
              <a [routerLink]="['/movies', heroMovie.id]">Featured Movie</a>
              <a routerLink="/movies">Browse Movies</a>
            </div>
          </div>

          <article class="hero-feature">
            <div class="hero-poster">
              <img [src]="heroMovie.posterUrl || defaultPoster" [alt]="heroMovie.title" (error)="handlePosterError($event)" />
            </div>

            <div class="hero-feature-copy">
              <h2>{{ heroMovie.title }}</h2>
              <p>{{ heroMovie.tagline }}</p>
              <div class="hero-meta">
                <span>{{ heroMovie.genre }}</span>
                <strong>{{ heroMovie.rating }}</strong>
              </div>
            </div>
          </article>
        </header>

        <app-movie-stats></app-movie-stats>

        <section class="dashboard-grid">
          <article class="panel">
            <div class="panel-head">
              <h3>Recent Movies</h3>
              <a routerLink="/movies">All Movies</a>
            </div>

            <div class="recent-grid">
              <a *ngFor="let movie of vm.recentMovies" [routerLink]="['/movies', movie.id]">
                <img [src]="movie.posterUrl || defaultPoster" [alt]="movie.title" (error)="handlePosterError($event)" />
                <div>
                  <strong>{{ movie.title }}</strong>
                  <small>{{ movie.director }}</small>
                </div>
                <span>{{ movie.releaseDate | date: 'yyyy' }}</span>
              </a>
            </div>
          </article>

          <article class="panel">
            <div class="panel-head">
              <h3>Top Directors</h3>
              <a routerLink="/directors">Director Library</a>
            </div>

            <div class="director-grid">
              <a *ngFor="let director of vm.topDirectors" [routerLink]="['/directors', director.id]">
                <strong>{{ director.name }}</strong>
                <small>{{ director.nationality }}</small>
              </a>
            </div>
          </article>
        </section>

        <app-movie-search></app-movie-search>
      </section>
    </ng-container>

    <ng-template #loadingState>
      <section class="dashboard-shell">
        <article class="panel loading-panel">
          <h2>Loading dashboard...</h2>
        </article>
      </section>
    </ng-template>
  `,
  styles: [`
    .dashboard-shell {
      max-width: 1360px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1rem;
    }

    .hero-stage,
    .panel {
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(16px);
      color: #fff8e7;
    }

    .hero-stage {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.9fr);
      gap: 1rem;
      padding: 1.2rem;
    }

    .kicker {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.75rem;
      color: rgba(255, 248, 225, 0.72);
    }

    h1 {
      margin: 0.5rem 0;
      font-size: clamp(2rem, 4vw, 3.4rem);
      line-height: 1;
    }

    .copy {
      margin: 0;
      color: rgba(255, 248, 225, 0.72);
    }

    .hero-actions {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
    }

    .hero-actions a,
    .panel-head a,
    .recent-grid a,
    .director-grid a {
      text-decoration: none;
      transition: transform 0.2s ease;
    }

    .hero-actions a,
    .panel-head a {
      min-height: 42px;
      padding: 0 1rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      font-weight: 700;
    }

    .hero-actions a:hover,
    .panel-head a:hover,
    .recent-grid a:hover,
    .director-grid a:hover {
      transform: translateY(-2px);
    }

    .hero-feature {
      display: grid;
      grid-template-columns: 138px minmax(0, 1fr);
      gap: 1rem;
      align-items: stretch;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 1rem;
      background:
        linear-gradient(180deg, rgba(212, 175, 55, 0.18), rgba(255, 255, 255, 0.03)),
        rgba(10, 12, 20, 0.82);
    }

    .hero-poster {
      aspect-ratio: 2 / 3;
      overflow: hidden;
      border-radius: 14px;
      background: linear-gradient(180deg, #2d2417, #111);
    }

    .hero-poster img,
    .recent-grid img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .hero-feature-copy {
      min-width: 0;
      display: grid;
      align-content: center;
    }

    .hero-feature h2 {
      margin: 0;
      font-size: 2rem;
    }

    .hero-feature p {
      margin: 0.7rem 0 0;
      color: rgba(255, 248, 225, 0.74);
      line-height: 1.7;
    }

    .hero-meta {
      margin-top: 0.8rem;
      display: flex;
      justify-content: space-between;
      align-items: end;
      color: #fff8e7;
    }

    .hero-meta strong {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 2.4rem;
      color: #f6d878;
      line-height: 1;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .panel {
      padding: 1rem;
      display: grid;
      gap: 0.8rem;
    }

    .loading-panel {
      text-align: center;
    }

    .panel-head {
      display: flex;
      justify-content: space-between;
      gap: 0.7rem;
      align-items: center;
    }

    .panel-head h3 {
      margin: 0;
    }

    .recent-grid,
    .director-grid {
      display: grid;
      gap: 0.7rem;
    }

    .recent-grid a,
    .director-grid a {
      display: grid;
      gap: 0.35rem;
      padding: 0.85rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #fff8e7;
    }

    .recent-grid a {
      grid-template-columns: 56px minmax(0, 1fr) auto;
      align-items: center;
    }

    .recent-grid img {
      width: 56px;
      height: 78px;
      border-radius: 8px;
      background: #111;
    }

    .recent-grid div {
      min-width: 0;
      display: grid;
      gap: 0.35rem;
    }

    .recent-grid small,
    .director-grid small {
      color: rgba(255, 248, 225, 0.72);
    }

    .recent-grid span {
      color: #f6d878;
      font-size: 0.82rem;
    }

    @media (max-width: 980px) {
      .hero-stage,
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .dashboard-shell {
        padding: 1rem;
      }

      .hero-feature,
      .recent-grid a {
        grid-template-columns: 1fr;
      }

      .hero-poster {
        max-height: 360px;
      }
    }
  `]
})
export class DashboardComponent {
  private readonly movieStateService = inject(MovieStateService);
  private readonly directorService = inject(DirectorService);

  readonly defaultPoster = 'assets/default-poster.jpg';

  readonly viewModel$ = combineLatest([
    this.movieStateService.movies$,
    this.directorService.getDirectors()
  ]).pipe(
    map(([movies, directors]) => ({
      heroMovie: [...movies].sort((a, b) => b.rating - a.rating)[0],
      recentMovies: movies.slice(-4).reverse(),
      topDirectors: directors.slice(0, 4)
    }))
  );

  handlePosterError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultPoster;
  }
}

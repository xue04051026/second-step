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
    <section class="movie-detail-shell">
      <button type="button" class="back-btn" (click)="goBack()">Back</button>

      <ng-container *ngIf="viewModel$ | async as vm; else loadingState">
        <article class="detail-panel" *ngIf="vm.movie as movie; else notFound">
          <div class="poster-column">
            <img [src]="movie.posterUrl || defaultPoster" [alt]="movie.title" (error)="handlePosterError($event)" />
          </div>

          <div class="content-column">
            <p class="kicker">Movie Detail</p>
            <h1>{{ movie.title }}</h1>
            <p class="tagline">{{ movie.tagline }}</p>

            <div class="link-row">
              <a [routerLink]="['/directors', movie.directorId]" class="director-link">{{ movie.director }}</a>
              <a [routerLink]="['/movies/genre', movie.genre]" class="genre-link">{{ movie.genre }}</a>
            </div>

            <div class="stats-row">
              <div>
                <strong>{{ movie.rating }}</strong>
                <span>{{ movie.rating | ratingLevel }}</span>
              </div>
              <div>
                <strong>{{ movie.releaseDate | date: 'yyyy' }}</strong>
                <span>Release</span>
              </div>
              <div>
                <strong>{{ movie.runtime || '--' }}</strong>
                <span>Minutes</span>
              </div>
              <div>
                <strong>{{ movie.isWatched ? 'Watched' : 'Unwatched' }}</strong>
                <span>Status</span>
              </div>
            </div>

            <p class="summary">{{ movie.summary }}</p>

            <div class="action-row">
              <a routerLink="/movies">Back to Movies</a>
              <button type="button" class="danger-btn" (click)="deleteMovie(movie)">Delete</button>
            </div>

            <div class="pager-row">
              <a *ngIf="vm.prevMovieId" [routerLink]="['/movies', vm.prevMovieId]">← Previous</a>
              <span *ngIf="!vm.prevMovieId"></span>
              <a *ngIf="vm.nextMovieId" [routerLink]="['/movies', vm.nextMovieId]">Next →</a>
            </div>
          </div>
        </article>
      </ng-container>

      <ng-template #notFound>
        <article class="empty-panel">
          <h2>Movie Not Found</h2>
          <p>The movie may have been removed or the route parameter is invalid.</p>
          <a routerLink="/movies">Back to Movie List</a>
        </article>
      </ng-template>

      <ng-template #loadingState>
        <article class="empty-panel">
          <h2>Loading movie details...</h2>
        </article>
      </ng-template>
    </section>
  `,
  styles: [`
    .movie-detail-shell {
      max-width: 1280px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 0.9rem;
    }

    .back-btn,
    .action-row a,
    .action-row button,
    .pager-row a,
    .empty-panel a {
      min-height: 44px;
      padding: 0 1.1rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.06);
      color: #fff8e7;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    .back-btn:hover,
    .action-row a:hover,
    .action-row button:hover,
    .pager-row a:hover,
    .empty-panel a:hover {
      transform: translateY(-2px);
    }

    .detail-panel {
      display: grid;
      grid-template-columns: minmax(280px, 400px) minmax(0, 1fr);
      gap: 1.2rem;
      padding: 1.2rem;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
      color: #fff8e7;
    }

    .poster-column {
      border-radius: 20px;
      overflow: hidden;
      background: linear-gradient(180deg, #2d2417, #111);
    }

    .poster-column img {
      width: 100%;
      height: 100%;
      min-height: 560px;
      object-fit: cover;
      display: block;
    }

    .content-column {
      display: grid;
      gap: 0.9rem;
      align-content: start;
    }

    .kicker,
    .tagline,
    .summary,
    .stats-row span {
      color: rgba(255, 248, 225, 0.74);
    }

    .kicker {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.75rem;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.4rem, 4.8vw, 4.2rem);
      font-family: 'Cormorant Garamond', serif;
      line-height: 0.95;
    }

    .tagline {
      margin: 0;
    }

    .link-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
    }

    .link-row a {
      text-decoration: none;
      border-radius: 999px;
      padding: 0.35rem 0.8rem;
      font-size: 0.85rem;
    }

    .director-link {
      color: #b9def9;
      border: 1px solid rgba(185, 222, 249, 0.4);
    }

    .genre-link {
      color: #ffe9b1;
      border: 1px solid rgba(255, 233, 177, 0.4);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .stats-row div {
      display: grid;
      gap: 0.2rem;
      padding: 0.85rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .stats-row strong {
      color: #fff;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.45rem;
      line-height: 1;
    }

    .summary {
      margin: 0;
      line-height: 1.8;
    }

    .action-row,
    .pager-row {
      display: flex;
      gap: 0.8rem;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }

    .danger-btn {
      background: rgba(195, 58, 58, 0.24) !important;
    }

    .empty-panel {
      text-align: center;
      padding: 2.5rem 1.2rem;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      color: #fff8e7;
    }

    .empty-panel h2 {
      margin: 0;
    }

    .empty-panel p {
      margin: 0.75rem 0 0;
      color: rgba(255, 248, 225, 0.74);
    }

    .empty-panel a {
      margin-top: 1rem;
    }

    @media (max-width: 980px) {
      .detail-panel {
        grid-template-columns: 1fr;
      }

      .poster-column img {
        min-height: 420px;
      }

      .stats-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .movie-detail-shell {
        padding: 1rem;
      }

      .stats-row {
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
      this.messageService.add(`Movie detail load failed: ${error instanceof Error ? error.message : String(error)}`);
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
    if (!window.confirm('Delete this movie?')) {
      return;
    }

    this.movieStateService.delete(movie.id).subscribe({
      next: () => this.router.navigate(['/movies'])
    });
  }
}

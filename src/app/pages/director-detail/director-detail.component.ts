import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DirectorService } from '../../services/director.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-director-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="director-detail-shell" *ngIf="director$ | async as director; else notFound">
      <button type="button" class="back-btn" (click)="location.back()">Back</button>

      <article class="director-card">
        <h1>{{ director.name }}</h1>
        <p><strong>Nationality:</strong> {{ director.nationality }}</p>
        <p><strong>Birth Year:</strong> {{ director.birthYear }}</p>
        <p class="bio">{{ director.bio }}</p>
      </article>

      <article class="movies-card" *ngIf="directedMovies$ | async as movies">
        <div class="card-head">
          <h2>Filmography ({{ movies.length }})</h2>
        </div>

        <div class="movie-row" *ngFor="let movie of movies">
          <a [routerLink]="['/movies', movie.id]">{{ movie.title }}</a>
          <span>{{ movie.rating }}</span>
          <a class="genre-link" [routerLink]="['/movies/genre', movie.genre]">{{ movie.genre }}</a>
        </div>

        <p *ngIf="movies.length === 0" class="empty-copy">No movies found for this director.</p>
      </article>

      <div class="nav-buttons" *ngIf="navigation$ | async as nav">
        <a *ngIf="nav.prev" [routerLink]="['/directors', nav.prev.id]">← {{ nav.prev.name }}</a>
        <span *ngIf="!nav.prev"></span>
        <a *ngIf="nav.next" [routerLink]="['/directors', nav.next.id]">{{ nav.next.name }} →</a>
      </div>
    </section>

    <ng-template #notFound>
      <section class="director-detail-shell">
        <article class="director-card not-found-card">
          <h1>Director Not Found</h1>
          <p>The URL parameter may be invalid.</p>
          <a routerLink="/directors">Back to Director Library</a>
        </article>
      </section>
    </ng-template>
  `,
  styles: [`
    .director-detail-shell {
      max-width: 1080px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1rem;
    }

    .back-btn,
    .nav-buttons a,
    .not-found-card a {
      width: fit-content;
      min-height: 42px;
      padding: 0 1rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.05);
      color: #fff8e7;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .director-card,
    .movies-card,
    .nav-buttons {
      padding: 1.25rem;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      color: #fff8e7;
    }

    .director-card h1,
    .movies-card h2 {
      margin: 0;
    }

    .director-card p {
      margin: 0.7rem 0 0;
      color: rgba(255, 248, 225, 0.78);
      line-height: 1.7;
    }

    .bio {
      margin-top: 1rem;
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
    }

    .movie-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 0.8rem;
      align-items: center;
      padding: 0.7rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      margin-bottom: 0.6rem;
    }

    .movie-row > a:first-child {
      color: #fff8e7;
      text-decoration: none;
    }

    .movie-row span {
      color: #f6d878;
    }

    .genre-link {
      color: #b9def9;
      text-decoration: none;
      border: 1px solid rgba(185, 222, 249, 0.35);
      border-radius: 999px;
      padding: 0.2rem 0.65rem;
      font-size: 0.85rem;
    }

    .empty-copy {
      margin: 0;
      color: rgba(255, 248, 225, 0.72);
    }

    .nav-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .not-found-card {
      text-align: center;
    }

    .not-found-card a {
      margin: 1rem auto 0;
    }

    @media (max-width: 700px) {
      .movie-row {
        grid-template-columns: 1fr;
      }

      .nav-buttons {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class DirectorDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly directorService = inject(DirectorService);
  private readonly movieService = inject(MovieService);

  readonly location = inject(Location);

  private readonly currentId$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id')))
  );

  readonly director$ = this.currentId$.pipe(
    switchMap(id => this.directorService.getDirectorById(id)),
    catchError(() => of(undefined))
  );

  readonly directedMovies$ = this.currentId$.pipe(
    switchMap(directorId => this.movieService.getMovies().pipe(
      map(movies => movies.filter(movie => movie.directorId === directorId))
    ))
  );

  readonly navigation$ = combineLatest([
    this.currentId$,
    this.directorService.getDirectors()
  ]).pipe(
    map(([currentId, directors]) => {
      const index = directors.findIndex(director => director.id === currentId);
      return {
        prev: index > 0 ? directors[index - 1] : null,
        next: index >= 0 && index < directors.length - 1 ? directors[index + 1] : null
      };
    })
  );
}

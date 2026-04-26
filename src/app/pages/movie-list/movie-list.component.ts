import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, forkJoin, map, switchMap } from 'rxjs';
import { Movie } from '../../models/movie';
import { RatingLevelPipe } from '../../pipes/rating-level.pipe';
import { MovieStateService } from '../../services/movie-state.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RatingLevelPipe],
  template: `
    <ng-container *ngIf="viewModel$ | async as vm">
      <section class="movie-list-shell">
        <header class="hero">
          <div>
            <p class="kicker">Movies</p>
            <h1>{{ currentGenre ? currentGenre + ' Movies' : 'All Movies' }}</h1>
            <p>Route pattern: <code>{{ currentGenre ? '/movies/genre/:genre' : '/movies' }}</code></p>
          </div>
          <div class="count-box">
            <strong>{{ vm.filteredMovies.length }}</strong>
            <span>of {{ vm.allMovies.length }}</span>
          </div>
        </header>

        <section class="filters">
          <div class="genre-tags" *ngIf="genres$ | async as genres">
            <a
              routerLink="/movies"
              [queryParamsHandling]="'merge'"
              [class.active]="!currentGenre"
            >
              All
            </a>
            <a
              *ngFor="let genre of genres"
              [routerLink]="['/movies/genre', genre]"
              [queryParamsHandling]="'merge'"
              [class.active]="currentGenre === genre"
            >
              {{ genre }}
            </a>
          </div>

          <div class="control-row">
            <label>
              <span>Search</span>
              <input
                [(ngModel)]="searchTerm"
                (keyup.enter)="applyFilters()"
                placeholder="Search title or director"
              />
            </label>

            <label>
              <span>Sort By</span>
              <select [(ngModel)]="sortBy" (change)="applyFilters()">
                <option value="rating">Rating</option>
                <option value="releaseDate">Release Date</option>
                <option value="title">Title</option>
              </select>
            </label>

            <label>
              <span>Order</span>
              <select [(ngModel)]="sortOrder" (change)="applyFilters()">
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </label>

            <button type="button" class="ghost-btn" (click)="clearFilters()">Clear</button>
          </div>
        </section>

        <section class="batch-actions" *ngIf="vm.filteredMovies.length > 0">
          <label>
            <input
              type="checkbox"
              [checked]="vm.filteredMovies.length > 0 && selectedIds.size === vm.filteredMovies.length"
              (change)="toggleAll($any($event.target).checked, vm.filteredMovies)"
            />
            <span>Select all</span>
          </label>

          <button type="button" [disabled]="selectedIds.size === 0" (click)="deleteSelected()">
            Delete Selected ({{ selectedIds.size }})
          </button>
        </section>

        <section class="movie-grid" *ngIf="vm.filteredMovies.length > 0; else emptyState">
          <article class="movie-card" *ngFor="let movie of vm.filteredMovies; let i = index" [style.animationDelay.ms]="i * 60">
            <label class="select-box">
              <input
                type="checkbox"
                [checked]="selectedIds.has(movie.id)"
                (change)="toggleSelection(movie.id)"
              />
              <span>Select</span>
            </label>

            <div class="poster">
              <img [src]="movie.posterUrl || defaultPoster" [alt]="movie.title" (error)="handlePosterError($event)" />
            </div>

            <div class="content">
              <h2>{{ movie.title }}</h2>

              <div class="meta">
                <a [routerLink]="['/directors', movie.directorId]">{{ movie.director }}</a>
                <a [routerLink]="['/movies/genre', movie.genre]">{{ movie.genre }}</a>
              </div>

              <p>{{ movie.summary }}</p>

              <div class="footer">
                <div>
                  <strong>{{ movie.rating }}</strong>
                  <span>{{ movie.rating | ratingLevel }}</span>
                </div>
                <div class="actions">
                  <a [routerLink]="['/movies', movie.id]">Detail</a>
                  <button type="button" (click)="deleteMovie(movie.id)">Delete</button>
                </div>
              </div>
            </div>
          </article>
        </section>

        <ng-template #emptyState>
          <section class="empty-state">
            <h2>No movies matched your current filters.</h2>
            <button type="button" (click)="clearFilters()">Reset Filters</button>
          </section>
        </ng-template>
      </section>
    </ng-container>
  `,
  styles: [`
    .movie-list-shell {
      max-width: 1380px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1rem;
    }

    .hero,
    .filters,
    .empty-state {
      border-radius: 26px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(16px);
      color: #fff8e7;
    }

    .hero {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.2rem;
      align-items: end;
    }

    .kicker {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.75rem;
      color: rgba(255, 248, 225, 0.72);
    }

    h1 {
      margin: 0.35rem 0;
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-family: 'Cormorant Garamond', serif;
    }

    .hero p {
      margin: 0;
      color: rgba(255, 248, 225, 0.72);
    }

    .count-box {
      min-width: 92px;
      min-height: 92px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.08);
      display: grid;
      place-items: center;
      text-align: center;
      padding: 0.5rem;
    }

    .count-box strong {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 2.2rem;
      color: #f6d878;
      line-height: 1;
    }

    .count-box span {
      font-size: 0.8rem;
      color: rgba(255, 248, 225, 0.72);
    }

    .filters {
      padding: 1rem;
      display: grid;
      gap: 1rem;
    }

    .batch-actions {
      min-height: 58px;
      padding: 0.8rem 1rem;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(8, 11, 19, 0.9);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      color: #fff8e7;
    }

    .batch-actions label {
      display: inline-flex;
      grid-template-columns: none;
      align-items: center;
      gap: 0.5rem;
    }

    .batch-actions button {
      min-height: 40px;
      padding: 0 1rem;
      border-radius: 999px;
      background: rgba(195, 58, 58, 0.26);
      color: #fff8e7;
      cursor: pointer;
    }

    .batch-actions button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .genre-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .genre-tags a {
      min-height: 36px;
      padding: 0 0.85rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #fff8e7;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
    }

    .genre-tags a.active {
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      border-color: transparent;
      font-weight: 700;
    }

    .control-row {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto;
      gap: 0.8rem;
      align-items: end;
    }

    label {
      display: grid;
      gap: 0.45rem;
    }

    label span {
      font-size: 0.85rem;
      color: rgba(255, 248, 225, 0.72);
    }

    input,
    select {
      min-height: 44px;
      padding: 0 0.8rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      outline: none;
    }

    .ghost-btn {
      min-height: 44px;
      padding: 0 1rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: transparent;
      color: #fff8e7;
      cursor: pointer;
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .movie-card {
      position: relative;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(10, 13, 22, 0.94);
      overflow: hidden;
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
      animation: riseIn 0.5s ease both;
    }

    .select-box {
      position: absolute;
      z-index: 2;
      top: 0.75rem;
      left: 0.75rem;
      display: inline-flex;
      grid-template-columns: none;
      align-items: center;
      gap: 0.45rem;
      min-height: 34px;
      padding: 0 0.65rem;
      border-radius: 999px;
      background: rgba(5, 7, 13, 0.76);
      color: #fff8e7;
      backdrop-filter: blur(10px);
    }

    .poster {
      aspect-ratio: 2 / 3;
      background: linear-gradient(180deg, #2d2417, #111);
    }

    .poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .content {
      padding: 1rem;
      display: grid;
      gap: 0.7rem;
      color: #fff8e7;
    }

    h2 {
      margin: 0;
      font-size: 1.35rem;
      font-family: 'Cormorant Garamond', serif;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
    }

    .meta a {
      text-decoration: none;
      color: #b9def9;
      border: 1px solid rgba(185, 222, 249, 0.25);
      border-radius: 999px;
      padding: 0.2rem 0.6rem;
      font-size: 0.78rem;
    }

    .content p {
      margin: 0;
      color: rgba(255, 248, 225, 0.74);
      line-height: 1.7;
      min-height: 4.8em;
      font-size: 0.92rem;
    }

    .footer {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 0.7rem;
    }

    .footer strong {
      display: block;
      font-size: 2rem;
      line-height: 1;
      font-family: 'Barlow Condensed', sans-serif;
      color: #f6d878;
    }

    .footer span {
      color: rgba(255, 248, 225, 0.72);
      font-size: 0.85rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .actions a,
    .actions button {
      min-height: 36px;
      padding: 0 0.8rem;
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

    .empty-state {
      padding: 2.2rem 1rem;
      text-align: center;
    }

    .empty-state h2 {
      margin: 0;
    }

    .empty-state button {
      margin-top: 1rem;
      min-height: 42px;
      padding: 0 1rem;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      font-weight: 700;
      cursor: pointer;
    }

    @keyframes riseIn {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 880px) {
      .control-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieListComponent {
  private readonly movieStateService = inject(MovieStateService);
  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);

  readonly defaultPoster = 'assets/default-poster.jpg';

  searchTerm = '';
  currentGenre = '';
  sortBy = 'rating';
  sortOrder = 'desc';
  selectedIds = new Set<number>();

  readonly genres$ = this.movieStateService.movies$.pipe(
    map(movies => [...new Set(movies.map(movie => movie.genre))].sort((a, b) => a.localeCompare(b)))
  );

  readonly viewModel$ = combineLatest([
    this.route.paramMap,
    this.route.queryParamMap,
    this.refreshSubject
  ]).pipe(
    switchMap(([paramMap, queryParamMap]) => {
      this.currentGenre = paramMap.get('genre') || '';
      this.searchTerm = queryParamMap.get('search') || '';
      this.sortBy = queryParamMap.get('sortBy') || 'rating';
      this.sortOrder = queryParamMap.get('sortOrder') || 'desc';

      const movies$ = this.currentGenre
        ? this.movieStateService.movies$.pipe(
          switchMap(() => this.movieService.getMoviesByGenre(this.currentGenre))
        )
        : this.movieStateService.movies$;

      return movies$.pipe(
        map(movies => {
          const visibleIds = new Set(movies.map(movie => movie.id));
          this.selectedIds = new Set([...this.selectedIds].filter(id => visibleIds.has(id)));

          return {
            allMovies: movies,
            filteredMovies: this.filterMovies(movies)
          };
        })
      );
    })
  );

  applyFilters(): void {
    const queryParams: Record<string, string> = {};
    if (this.searchTerm) {
      queryParams['search'] = this.searchTerm;
    }
    if (this.sortBy !== 'rating') {
      queryParams['sortBy'] = this.sortBy;
    }
    if (this.sortOrder !== 'desc') {
      queryParams['sortOrder'] = this.sortOrder;
    }

    const commands = this.currentGenre ? ['/movies/genre', this.currentGenre] : ['/movies'];
    this.router.navigate(commands, { queryParams });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'rating';
    this.sortOrder = 'desc';
    const commands = this.currentGenre ? ['/movies/genre', this.currentGenre] : ['/movies'];
    this.router.navigate(commands);
  }

  handlePosterError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultPoster;
  }

  deleteMovie(id: number): void {
    if (!window.confirm('Delete this movie?')) {
      return;
    }

    this.movieStateService.delete(id).subscribe({
      next: () => this.refreshSubject.next()
    });
  }

  toggleSelection(id: number): void {
    const nextSelection = new Set(this.selectedIds);
    if (nextSelection.has(id)) {
      nextSelection.delete(id);
    } else {
      nextSelection.add(id);
    }
    this.selectedIds = nextSelection;
  }

  toggleAll(checked: boolean, movies: Movie[]): void {
    this.selectedIds = checked ? new Set(movies.map(movie => movie.id)) : new Set<number>();
  }

  deleteSelected(): void {
    if (this.selectedIds.size === 0 || !window.confirm(`Delete ${this.selectedIds.size} selected movies?`)) {
      return;
    }

    const ids = [...this.selectedIds];
    forkJoin(ids.map(id => this.movieStateService.delete(id))).subscribe({
      next: () => {
        this.selectedIds = new Set<number>();
        this.movieStateService.load(true);
        this.refreshSubject.next();
      }
    });
  }

  private filterMovies(movies: Movie[]): Movie[] {
    let result = [...movies];

    if (this.currentGenre) {
      result = result.filter(movie => movie.genre === this.currentGenre);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(term) ||
        movie.director.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (this.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title, 'en');
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

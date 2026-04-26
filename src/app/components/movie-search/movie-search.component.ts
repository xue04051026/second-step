import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="search-panel">
      <div class="search-head">
        <p class="kicker">Search</p>
        <h3>Movie Lookup</h3>
      </div>

      <input
        #searchBox
        type="search"
        (input)="search(searchBox.value)"
        placeholder="Search movie title"
        class="search-input"
      />

      <ul class="search-results" *ngIf="movies$ | async as movies">
        <li *ngFor="let movie of movies">
          <a [routerLink]="['/movies', movie.id]">
            <span>{{ movie.title }}</span>
            <small>{{ movie.genre }}</small>
            <strong>{{ movie.rating }}</strong>
          </a>
        </li>
      </ul>
    </section>
  `,
  styles: [`
    .search-panel {
      padding: 1rem;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      color: #fff8e7;
      display: grid;
      gap: 0.85rem;
    }

    .search-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem;
    }

    .kicker {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.75rem;
      color: rgba(255, 248, 225, 0.72);
    }

    h3 {
      margin: 0.25rem 0 0;
      font-size: 1.35rem;
    }

    .search-input {
      width: 100%;
      min-height: 44px;
      padding: 0 0.85rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      outline: none;
    }

    .search-results {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.55rem;
    }

    .search-results a {
      min-height: 48px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 0.7rem;
      padding: 0.65rem 0.8rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      color: #fff8e7;
      text-decoration: none;
    }

    .search-results small {
      color: #b9def9;
    }

    .search-results strong {
      color: #f6d878;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.2rem;
    }
  `]
})
export class MovieSearchComponent implements OnInit {
  movies$!: Observable<Movie[]>;

  private readonly movieService = inject(MovieService);
  private readonly searchTerms = new Subject<string>();

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.movies$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.movieService.searchMovies(term))
    );
  }
}

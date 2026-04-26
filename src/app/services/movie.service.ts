import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = 'http://localhost:5000/api/movies';
  private readonly fallbackPoster = 'assets/default-poster.jpg';
  private readonly localPosterCount = 6;

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      map(list => list.map(movie => this.withPoster(movie))),
      tap(list => this.messageService.add(`MovieService: loaded ${list.length} movies from API`)),
      catchError(this.handleError<Movie[]>('getMovies', []))
    );
  }

  getMovie(id: number): Observable<Movie | undefined> {
    return this.getMovieById(id);
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
      map(movie => this.withPoster(movie)),
      tap(movie => this.messageService.add(`MovieService: found movie ${movie.title}`)),
      catchError(this.handleError<Movie | undefined>(`getMovieById id=${id}`, undefined))
    );
  }

  searchMovies(term: string): Observable<Movie[]> {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      return of([]);
    }

    const params = new HttpParams().set('title', trimmedTerm);
    return this.http.get<Movie[]>(this.apiUrl, { params }).pipe(
      map(list => list.map(movie => this.withPoster(movie))),
      tap(list => {
        const message = list.length
          ? `MovieService: found ${list.length} movies for "${trimmedTerm}"`
          : `MovieService: no movies matched "${trimmedTerm}"`;
        this.messageService.add(message);
      }),
      catchError(this.handleError<Movie[]>('searchMovies', []))
    );
  }

  getMoviesByGenre(genre: string): Observable<Movie[]> {
    const trimmedGenre = genre.trim();
    if (!trimmedGenre) {
      return this.getMovies();
    }

    const params = new HttpParams().set('genre', trimmedGenre);
    return this.http.get<Movie[]>(this.apiUrl, { params }).pipe(
      map(list => list.map(movie => this.withPoster(movie))),
      tap(list => this.messageService.add(`MovieService: ${trimmedGenre} genre has ${list.length} movies`)),
      catchError(this.handleError<Movie[]>('getMoviesByGenre', []))
    );
  }

  addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, this.withPosterPayload(movie), httpOptions).pipe(
      map(created => this.withPoster(created)),
      tap(created => this.messageService.add(`MovieService: added movie ${created.title}`)),
      catchError(this.handleMutationError<Movie>('addMovie'))
    );
  }

  updateMovie(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${movie.id}`, this.withPoster(movie), httpOptions).pipe(
      map(updated => this.withPoster(updated)),
      tap(updated => this.messageService.add(`MovieService: updated movie ${updated.title}`)),
      catchError(this.handleMutationError<Movie>('updateMovie'))
    );
  }

  deleteMovie(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`, httpOptions).pipe(
      map(() => true),
      tap(() => this.messageService.add(`MovieService: deleted movie id=${id}`)),
      catchError(this.handleMutationError<boolean>('deleteMovie'))
    );
  }

  private withPoster(movie: Movie): Movie {
    const normalizedPoster = this.normalizePosterUrl(movie.posterUrl);

    return {
      ...movie,
      posterUrl: normalizedPoster || this.posterFromId(movie.id)
    };
  }

  private withPosterPayload(movie: Omit<Movie, 'id'>): Omit<Movie, 'id'> {
    const normalizedPoster = this.normalizePosterUrl(movie.posterUrl);

    return {
      ...movie,
      posterUrl: normalizedPoster || this.fallbackPoster
    };
  }

  private normalizePosterUrl(posterUrl?: string): string {
    const value = (posterUrl ?? '').trim();
    if (!value) {
      return '';
    }

    if (value.startsWith('/assets/')) {
      return value.slice(1);
    }

    return value;
  }

  private posterFromId(id: number): string {
    const safeId = Number.isFinite(id) ? Math.abs(Math.trunc(id)) : 0;
    const index = ((safeId || 1) - 1) % this.localPosterCount + 1;
    return `assets/images/${index}.jpg`;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      this.logError(operation, error);
      return of(result as T);
    };
  }

  private handleMutationError<T>(operation = 'operation') {
    return (error: unknown): Observable<T> => {
      this.logError(operation, error);
      return throwError(() => error);
    };
  }

  private logError(operation: string, error: unknown): void {
    console.error(`${operation} failed:`, error);
    this.messageService.add(`${operation} failed: ${this.describeError(error)}`);
  }

  private describeError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message?: unknown }).message);
    }

    return String(error);
  }
}

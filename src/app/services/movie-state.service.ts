import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MessageService } from './message.service';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class MovieStateService {
  private readonly movieService = inject(MovieService);
  private readonly messageService = inject(MessageService);
  private readonly moviesSubject = new BehaviorSubject<Movie[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly visitedIdsSubject = new BehaviorSubject<number[]>([]);

  readonly movies$: Observable<Movie[]> = this.moviesSubject.asObservable();
  readonly count$ = this.movies$.pipe(map(list => list.length));
  readonly watched$ = this.movies$.pipe(map(list => list.filter(movie => movie.isWatched)));
  readonly unwatched$ = this.movies$.pipe(map(list => list.filter(movie => !movie.isWatched)));
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  readonly visitedIds$ = this.visitedIdsSubject.asObservable();
  readonly visitedMovies$ = combineLatest([this.movies$, this.visitedIds$]).pipe(
    map(([movies, ids]) =>
      ids
        .map(id => movies.find(movie => movie.id === id))
        .filter((movie): movie is Movie => !!movie)
    )
  );

  private loaded = false;

  load(force = false): void {
    if (this.loaded && !force) {
      return;
    }

    this.loaded = true;
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.movieService.getMovies().pipe(
      tap(list => this.messageService.add(`MovieState: loaded ${list.length} movies into state`)),
      catchError(error => {
        this.loaded = false;
        this.errorSubject.next(this.describeError(error));
        return of([]);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(list => this.moviesSubject.next(list));
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    return this.movies$.pipe(map(list => list.find(movie => movie.id === id)));
  }

  add(movie: Omit<Movie, 'id'>): Observable<Movie> {
    const tempId = -Date.now();
    const tempMovie = { ...movie, id: tempId } as Movie;
    this.addLocal(tempMovie);

    return this.movieService.addMovie(movie).pipe(
      tap(created => {
        this.moviesSubject.next(
          this.moviesSubject.value.map(item => (item.id === tempId ? created : item))
        );
        this.messageService.add(`MovieState: optimistic add confirmed for ${created.title}`);
      }),
      catchError(error => {
        this.removeLocal(tempId);
        this.messageService.add('MovieState: optimistic add rolled back');
        return throwError(() => error);
      })
    );
  }

  update(movie: Movie): Observable<Movie> {
    const snapshot = this.moviesSubject.value;
    this.updateLocal(movie);

    return this.movieService.updateMovie(movie).pipe(
      tap(updated => this.updateLocal(updated)),
      catchError(error => {
        this.moviesSubject.next(snapshot);
        this.messageService.add(`MovieState: update rolled back for id=${movie.id}`);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<boolean> {
    const snapshot = this.moviesSubject.value;
    const removed = snapshot.find(movie => movie.id === id);
    this.removeLocal(id);

    return this.movieService.deleteMovie(id).pipe(
      tap(() => this.messageService.add(`MovieState: optimistic delete confirmed for id=${id}`)),
      catchError(error => {
        if (removed) {
          this.moviesSubject.next(snapshot);
        }
        this.messageService.add(`MovieState: delete rolled back for id=${id}`);
        return throwError(() => error);
      })
    );
  }

  deleteOptimistic(id: number): void {
    this.delete(id).subscribe();
  }

  addOptimistic(movie: Omit<Movie, 'id'>): void {
    this.add(movie).subscribe();
  }

  addLocal(movie: Movie): void {
    const snapshot = this.moviesSubject.value;
    this.moviesSubject.next([...snapshot, movie]);
  }

  removeLocal(id: number): void {
    const snapshot = this.moviesSubject.value;
    this.moviesSubject.next(snapshot.filter(movie => movie.id !== id));
  }

  updateLocal(movie: Movie): void {
    const snapshot = this.moviesSubject.value;
    this.moviesSubject.next(snapshot.map(item => (item.id === movie.id ? movie : item)));
  }

  markAsVisited(id: number): void {
    const snapshot = this.visitedIdsSubject.value.filter(item => item !== id);
    this.visitedIdsSubject.next([id, ...snapshot].slice(0, 5));
    this.messageService.add(`MovieState: recorded recent visit id=${id}`);
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

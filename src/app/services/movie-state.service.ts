import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
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

  load(): void {
    if (this.loaded) {
      return;
    }

    this.loaded = true;
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.movieService.getMovies().pipe(
      tap(list => this.messageService.add(`MovieState: 已加载 ${list.length} 部电影到状态中心`)),
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
    return this.movieService.addMovie(movie).pipe(
      tap(created => this.addLocal(created))
    );
  }

  update(movie: Movie): Observable<Movie> {
    return this.movieService.updateMovie(movie).pipe(
      tap(updated => this.updateLocal(updated))
    );
  }

  delete(id: number): Observable<boolean> {
    return this.movieService.deleteMovie(id).pipe(
      tap(deleted => {
        if (deleted) {
          this.removeLocal(id);
        }
      })
    );
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
    this.messageService.add(`MovieState: 已记录最近浏览 id=${id}`);
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}

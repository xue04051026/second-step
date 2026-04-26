import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Director } from '../models/director';
import { Movie } from '../models/movie';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DirectorService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly apiUrl = 'http://localhost:5000/api/directors';

  getDirectors(): Observable<Director[]> {
    return this.http.get<Director[]>(this.apiUrl).pipe(
      tap(list => this.messageService.add(`DirectorService: loaded ${list.length} directors from API`)),
      catchError(this.handleError<Director[]>('getDirectors', []))
    );
  }

  getDirectorById(id: number): Observable<Director | undefined> {
    return this.http.get<Director>(`${this.apiUrl}/${id}`).pipe(
      tap(director => this.messageService.add(`DirectorService: found director ${director.name}`)),
      catchError(this.handleError<Director | undefined>(`getDirectorById id=${id}`, undefined))
    );
  }

  getDirectorMovies(directorId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/${directorId}/movies`).pipe(
      tap(list => this.messageService.add(`DirectorService: director id=${directorId} has ${list.length} movies`)),
      catchError(this.handleError<Movie[]>('getDirectorMovies', []))
    );
  }

  addDirector(director: Omit<Director, 'id'>): Observable<Director> {
    return this.http.post<Director>(this.apiUrl, director, httpOptions).pipe(
      tap(created => this.messageService.add(`DirectorService: added director ${created.name}`)),
      catchError(this.handleMutationError<Director>('addDirector'))
    );
  }

  updateDirector(director: Director): Observable<Director> {
    return this.http.put<Director>(`${this.apiUrl}/${director.id}`, director, httpOptions).pipe(
      tap(updated => this.messageService.add(`DirectorService: updated director ${updated.name}`)),
      catchError(this.handleMutationError<Director>('updateDirector'))
    );
  }

  deleteDirector(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`, httpOptions).pipe(
      map(() => true),
      tap(() => this.messageService.add(`DirectorService: deleted director id=${id}`)),
      catchError(this.handleMutationError<boolean>('deleteDirector'))
    );
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

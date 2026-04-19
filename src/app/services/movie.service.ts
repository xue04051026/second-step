import { Injectable, inject } from '@angular/core';
import { Observable, defer, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly messageService = inject(MessageService);
  private readonly fallbackPoster = '/assets/default-poster.jpg';

  private movies: Movie[] = [
    {
      id: 1,
      title: 'Interstellar',
      director: 'Christopher Nolan',
      directorId: 1,
      releaseDate: new Date('2014-11-07'),
      rating: 9.3,
      isWatched: true,
      genre: 'Sci-Fi',
      runtime: 169,
      country: 'USA / UK',
      language: 'English',
      tagline: 'Love is the one thing that transcends time and space.',
      summary: 'A team of explorers travels through a wormhole in space to ensure humanity has a future.',
      posterUrl: '/assets/images/1.jpg'
    },
    {
      id: 2,
      title: 'Inception',
      director: 'Christopher Nolan',
      directorId: 1,
      releaseDate: new Date('2010-07-16'),
      rating: 9.2,
      isWatched: true,
      genre: 'Sci-Fi',
      runtime: 148,
      country: 'USA / UK',
      language: 'English',
      tagline: 'Your mind is the scene of the crime.',
      summary: 'A skilled thief enters people’s dreams to steal secrets and attempts one final high-risk mission.',
      posterUrl: '/assets/images/2.jpg'
    },
    {
      id: 3,
      title: 'The Dark Knight',
      director: 'Christopher Nolan',
      directorId: 1,
      releaseDate: new Date('2008-07-18'),
      rating: 9.1,
      isWatched: false,
      genre: 'Action',
      runtime: 152,
      country: 'USA / UK',
      language: 'English',
      tagline: 'Welcome to a world without rules.',
      summary: 'Batman, Gordon, and Dent push back against organized crime while facing the chaos created by the Joker.',
      posterUrl: '/assets/images/3.jpg'
    },
    {
      id: 4,
      title: 'Crouching Tiger, Hidden Dragon',
      director: 'Ang Lee',
      directorId: 2,
      releaseDate: new Date('2000-07-07'),
      rating: 8.9,
      isWatched: true,
      genre: 'Wuxia',
      runtime: 120,
      country: 'China / Taiwan / Hong Kong',
      language: 'Mandarin',
      tagline: 'A timeless tale of love and honor.',
      summary: 'A legendary sword and tangled relationships draw warriors into a story of duty, desire, and sacrifice.',
      posterUrl: '/assets/images/4.jpg'
    },
    {
      id: 5,
      title: 'Life of Pi',
      director: 'Ang Lee',
      directorId: 2,
      releaseDate: new Date('2012-11-21'),
      rating: 8.8,
      isWatched: false,
      genre: 'Drama',
      runtime: 127,
      country: 'USA / Taiwan',
      language: 'English',
      tagline: 'Believe the unbelievable.',
      summary: 'After a shipwreck, a young man survives on a lifeboat with a Bengal tiger, confronting faith and survival.',
      posterUrl: '/assets/images/5.jpg'
    },
    {
      id: 6,
      title: 'Spirited Away',
      director: 'Hayao Miyazaki',
      directorId: 3,
      releaseDate: new Date('2001-07-20'),
      rating: 9.4,
      isWatched: true,
      genre: 'Animation',
      runtime: 125,
      country: 'Japan',
      language: 'Japanese',
      tagline: 'A coming-of-age in a spirit world.',
      summary: 'A girl trapped in a mysterious spirit realm works to save her parents and find her way back.',
      posterUrl: '/assets/images/6.jpg'
    },
    {
      id: 7,
      title: 'My Neighbor Totoro',
      director: 'Hayao Miyazaki',
      directorId: 3,
      releaseDate: new Date('1988-04-16'),
      rating: 8.9,
      isWatched: true,
      genre: 'Animation',
      runtime: 86,
      country: 'Japan',
      language: 'Japanese',
      tagline: 'A gentle childhood fantasy.',
      summary: 'Two sisters in rural Japan encounter magical woodland spirits while adjusting to a new life.',
      posterUrl: '/assets/images/1.jpg'
    },
    {
      id: 8,
      title: 'In the Mood for Love',
      director: 'Wong Kar-wai',
      directorId: 4,
      releaseDate: new Date('2000-09-29'),
      rating: 8.7,
      isWatched: false,
      genre: 'Drama',
      runtime: 98,
      country: 'Hong Kong, China',
      language: 'Cantonese',
      tagline: 'A restrained romance in neon shadows.',
      summary: 'Two neighbors discover their spouses’ affair and gradually form a complex emotional bond.',
      posterUrl: '/assets/images/2.jpg'
    },
    {
      id: 9,
      title: 'Chungking Express',
      director: 'Wong Kar-wai',
      directorId: 4,
      releaseDate: new Date('1994-07-14'),
      rating: 8.6,
      isWatched: false,
      genre: 'Romance',
      runtime: 102,
      country: 'Hong Kong, China',
      language: 'Cantonese',
      tagline: 'Two stories of loneliness and connection.',
      summary: 'Two drifting policemen and two women cross paths in a city where timing changes everything.',
      posterUrl: '/assets/images/3.jpg'
    }
  ];

  private nextId = 10;

  getMovies(): Observable<Movie[]> {
    return of(this.movies.map(movie => this.withPoster(movie))).pipe(
      delay(200),
      tap(list => this.messageService.add(`MovieService: loaded ${list.length} movies`)),
      catchError(error => {
        this.messageService.add(`MovieService: load failed - ${this.describeError(error)}`);
        return of([]);
      })
    );
  }

  getMovie(id: number): Observable<Movie | undefined> {
    return this.getMovieById(id);
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    return of(this.movies.find(item => item.id === id)).pipe(
      delay(150),
      tap(movie => {
        this.messageService.add(
          movie ? `MovieService: found movie ${movie.title}` : `MovieService: movie id=${id} not found`
        );
      }),
      catchError(error => {
        this.messageService.add(`MovieService: query failed - ${this.describeError(error)}`);
        return of(undefined);
      })
    );
  }

  addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
    return defer(() => {
      const newMovie: Movie = {
        ...movie,
        id: this.nextId++,
        directorId: this.resolveDirectorId(movie.directorId, movie.director),
        posterUrl: movie.posterUrl || this.fallbackPoster
      };

      this.movies = [...this.movies, newMovie];
      return of(this.withPoster(newMovie));
    }).pipe(
      delay(150),
      tap(created => this.messageService.add(`MovieService: added movie ${created.title}`)),
      catchError(error => {
        this.messageService.add(`MovieService: add failed - ${this.describeError(error)}`);
        return throwError(() => error);
      })
    );
  }

  updateMovie(updatedMovie: Movie): Observable<Movie> {
    return defer(() => {
      const movie = this.withPoster({
        ...updatedMovie,
        directorId: this.resolveDirectorId(updatedMovie.directorId, updatedMovie.director)
      });
      this.movies = this.movies.map(item => (item.id === movie.id ? movie : item));
      return of(movie);
    }).pipe(
      delay(150),
      tap(movie => this.messageService.add(`MovieService: updated movie ${movie.title}`)),
      catchError(error => {
        this.messageService.add(`MovieService: update failed - ${this.describeError(error)}`);
        return throwError(() => error);
      })
    );
  }

  deleteMovie(id: number): Observable<boolean> {
    let deletedTitle = '';

    return defer(() => {
      const target = this.movies.find(movie => movie.id === id);
      deletedTitle = target?.title || '';
      this.movies = this.movies.filter(movie => movie.id !== id);
      return of(!!target);
    }).pipe(
      delay(150),
      tap(deleted => {
        this.messageService.add(
          deleted ? `MovieService: removed movie ${deletedTitle}` : `MovieService: remove failed, id=${id}`
        );
      }),
      catchError(error => {
        this.messageService.add(`MovieService: remove failed - ${this.describeError(error)}`);
        return throwError(() => error);
      })
    );
  }

  private resolveDirectorId(directorId: number, directorName: string): number {
    if (directorId > 0) {
      return directorId;
    }

    const normalizedName = directorName.trim().toLowerCase();
    const directMatch = this.movies.find(movie => movie.director.toLowerCase() === normalizedName);
    return directMatch?.directorId ?? 0;
  }

  private withPoster(movie: Movie): Movie {
    return {
      ...movie,
      posterUrl: movie.posterUrl || this.fallbackPoster
    };
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}

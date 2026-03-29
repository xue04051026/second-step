import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: '肖申克的救赎',
      director: '弗兰克·德拉邦特',
      releaseDate: new Date('1994-09-23'),
      rating: 9.3,
      isWatched: true,
      posterUrl: '/picture/1.jpg'
    },
    {
      id: 2,
      title: '霸王别姬',
      director: '陈凯歌',
      releaseDate: new Date('1993-01-01'),
      rating: 9.5,
      isWatched: false,
      posterUrl: '/picture/2.jpg'
    },
    {
      id: 3,
      title: '阿甘正传',
      director: '罗伯特·泽米吉斯',
      releaseDate: new Date('1994-07-06'),
      rating: 9.1,
      isWatched: true,
      posterUrl: '/picture/3.jpg'
    },
    {
      id: 4,
      title: '泰坦尼克号',
      director: '詹姆斯·卡梅隆',
      releaseDate: new Date('1997-12-19'),
      rating: 9.4,
      isWatched: false,
      posterUrl: '/picture/4.jpg'
    },
    {
      id: 5,
      title: '千与千寻',
      director: '宫崎骏',
      releaseDate: new Date('2001-07-20'),
      rating: 9.2,
      isWatched: true,
      posterUrl: '/picture/5.jpg'
    },
    {
      id: 6,
      title: '盗梦空间',
      director: '克里斯托弗·诺兰',
      releaseDate: new Date('2010-07-16'),
      rating: 9.0,
      isWatched: false,
      posterUrl: '/picture/6.jpg'
    }
  ];

  private nextId = 7;

  getMovies(): Movie[] {
    return this.movies.map(movie => ({
      ...movie,
      posterUrl: movie.posterUrl || `/picture/${movie.id}.jpg`
    }));
  }

  getMovie(id: number): Movie | undefined {
    const movie = this.movies.find(movie => movie.id === id);
    if (!movie) {
      return undefined;
    }
    return {
      ...movie,
      posterUrl: movie.posterUrl || `/picture/${movie.id}.jpg`
    };
  }

  getMovieById(id: number): Movie | undefined {
    return this.getMovie(id);
  }

  addMovie(movie: Omit<Movie, 'id'>): void {
    const newMovie: Movie = {
      ...movie,
      id: this.nextId++
    };
    this.movies.push(newMovie);
  }

  updateMovie(updatedMovie: Movie): void {
    const index = this.movies.findIndex(movie => movie.id === updatedMovie.id);
    if (index !== -1) {
      this.movies[index] = updatedMovie;
    }
  }

  deleteMovie(id: number): void {
    this.movies = this.movies.filter(movie => movie.id !== id);
  }
}
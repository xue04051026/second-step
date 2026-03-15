import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-movie-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './movie-stats.component.html',
  styleUrls: ['./movie-stats.component.css']
})
export class MovieStatsComponent {
  @Input() movies: Movie[] = [];

  get totalMovies(): number {
    return this.movies.length;
  }

  get watchedPercentage(): number {
    if (this.totalMovies === 0) return 0;
    const watchedCount = this.movies.filter(movie => movie.isWatched).length;
    return (watchedCount / this.totalMovies) * 100;
  }

  get averageRating(): number {
    if (this.totalMovies === 0) return 0;
    const totalRating = this.movies.reduce((sum, movie) => sum + movie.rating, 0);
    return parseFloat((totalRating / this.totalMovies).toFixed(1));
  }
}

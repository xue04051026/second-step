import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Movie } from '../models/movie';
import { MOCK_MOVIES } from '../mock-movies';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { MovieStatsComponent } from '../movie-stats/movie-stats.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, MovieDetailComponent, MovieStatsComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {
  movies: Movie[] = MOCK_MOVIES;
  selectedMovie: Movie | undefined;

  onSelect(movie: Movie): void {
    this.selectedMovie = movie;
  }
}
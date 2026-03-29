import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie } from '../models/movie';
import { RatingLevelPipe } from '../pipes/rating-level.pipe';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingLevelPipe],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent {
  @Input() movie?: Movie;
  @Output() movieChange = new EventEmitter<Movie>();

  onTitleChange(newTitle: string): void {
    if (this.movie) {
      this.movie.title = newTitle;
      this.movieChange.emit(this.movie);
    }
  }
}
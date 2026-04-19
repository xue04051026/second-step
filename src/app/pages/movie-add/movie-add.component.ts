import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Director } from '../../models/director';
import { Movie } from '../../models/movie';
import { DirectorService } from '../../services/director.service';
import { MovieStateService } from '../../services/movie-state.service';

@Component({
  selector: 'app-movie-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="movie-add-shell">
      <header class="panel">
        <p class="kicker">Add Movie</p>
        <h1>Create a New Movie Entry</h1>
        <p>Route is guarded by <code>authGuard</code>. Login with <code>admin/admin</code> first.</p>
      </header>

      <section class="panel form-panel">
        <form #movieForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <label class="field full-span">
              <span>Title</span>
              <input [(ngModel)]="newMovie.title" name="title" required />
            </label>

            <label class="field">
              <span>Director</span>
              <select [(ngModel)]="newMovie.directorId" name="directorId" required>
                <option [ngValue]="0">Select Director</option>
                <option *ngFor="let director of directors" [ngValue]="director.id">{{ director.name }}</option>
              </select>
            </label>

            <label class="field">
              <span>Genre</span>
              <input [(ngModel)]="newMovie.genre" name="genre" required />
            </label>

            <label class="field">
              <span>Release Date</span>
              <input [(ngModel)]="releaseDateInput" name="releaseDate" type="date" />
            </label>

            <label class="field">
              <span>Rating</span>
              <input [(ngModel)]="newMovie.rating" name="rating" type="number" min="0" max="10" step="0.1" />
            </label>

            <label class="field">
              <span>Runtime (min)</span>
              <input [(ngModel)]="runtimeInput" name="runtime" type="number" min="1" />
            </label>

            <label class="field">
              <span>Country</span>
              <input [(ngModel)]="newMovie.country" name="country" />
            </label>

            <label class="field">
              <span>Language</span>
              <input [(ngModel)]="newMovie.language" name="language" />
            </label>

            <label class="field full-span">
              <span>Tagline</span>
              <input [(ngModel)]="newMovie.tagline" name="tagline" />
            </label>

            <label class="field full-span">
              <span>Summary</span>
              <textarea [(ngModel)]="newMovie.summary" name="summary" rows="4"></textarea>
            </label>

            <label class="field full-span">
              <span>Poster URL</span>
              <input [(ngModel)]="newMovie.posterUrl" name="posterUrl" />
            </label>

            <label class="toggle-field full-span">
              <input [(ngModel)]="newMovie.isWatched" name="isWatched" type="checkbox" />
              <span>Already watched</span>
            </label>
          </div>

          <div class="action-row">
            <a routerLink="/movies" class="ghost-btn">Back</a>
            <button type="submit" class="primary-btn" [disabled]="!movieForm.form.valid || saving">
              {{ saving ? 'Saving...' : 'Save Movie' }}
            </button>
          </div>

          <p class="error-text" *ngIf="errorMsg">{{ errorMsg }}</p>
        </form>
      </section>
    </section>
  `,
  styles: [`
    .movie-add-shell {
      max-width: 1080px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1rem;
    }

    .panel {
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(16px);
      color: #fff8e7;
      padding: 1.1rem;
    }

    .kicker {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.75rem;
      color: rgba(255, 248, 225, 0.72);
    }

    h1 {
      margin: 0.45rem 0;
    }

    .panel p {
      margin: 0;
      color: rgba(255, 248, 225, 0.72);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
    }

    .field,
    .toggle-field {
      display: grid;
      gap: 0.45rem;
    }

    .full-span {
      grid-column: 1 / -1;
    }

    .field span,
    .toggle-field span {
      color: rgba(255, 248, 225, 0.72);
      font-size: 0.85rem;
    }

    input,
    select,
    textarea {
      min-height: 44px;
      padding: 0 0.8rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      outline: none;
    }

    textarea {
      min-height: 120px;
      padding-top: 0.75rem;
      resize: vertical;
    }

    .toggle-field {
      grid-template-columns: auto 1fr;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 0.7rem 0.85rem;
    }

    .action-row {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.7rem;
      flex-wrap: wrap;
    }

    .ghost-btn,
    .primary-btn {
      min-height: 42px;
      padding: 0 1rem;
      border-radius: 999px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .ghost-btn {
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.05);
      color: #fff8e7;
    }

    .primary-btn {
      border: none;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      font-weight: 700;
      cursor: pointer;
    }

    .primary-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .error-text {
      margin: 0.75rem 0 0;
      color: #ffb8b8;
      text-align: right;
    }

    @media (max-width: 760px) {
      .movie-add-shell {
        padding: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieAddComponent {
  private readonly movieStateService = inject(MovieStateService);
  private readonly directorService = inject(DirectorService);
  private readonly router = inject(Router);

  directors: Director[] = [];

  saving = false;
  errorMsg = '';

  newMovie: Omit<Movie, 'id'> = {
    title: '',
    director: '',
    directorId: 0,
    releaseDate: new Date(),
    rating: 7.0,
    isWatched: false,
    posterUrl: '',
    genre: '',
    runtime: undefined,
    country: '',
    language: '',
    tagline: '',
    summary: ''
  };

  constructor() {
    this.directorService.getDirectors().subscribe(list => {
      this.directors = list;
      if (list.length > 0 && this.newMovie.directorId === 0) {
        this.newMovie.directorId = list[0].id;
      }
    });
  }

  get releaseDateInput(): string {
    const date = new Date(this.newMovie.releaseDate);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  set releaseDateInput(value: string) {
    this.newMovie.releaseDate = value ? new Date(value) : new Date();
  }

  get runtimeInput(): number | null {
    return this.newMovie.runtime ?? null;
  }

  set runtimeInput(value: number | null) {
    this.newMovie.runtime = value ?? undefined;
  }

  onSubmit(): void {
    if (!this.newMovie.title || this.newMovie.directorId <= 0 || !this.newMovie.genre) {
      return;
    }

    const selectedDirector = this.directors.find(director => director.id === this.newMovie.directorId);
    const payload: Omit<Movie, 'id'> = {
      ...this.newMovie,
      director: selectedDirector?.name || this.newMovie.director || 'Unknown Director',
      posterUrl: this.newMovie.posterUrl || '/assets/default-poster.jpg'
    };

    this.saving = true;
    this.errorMsg = '';

    this.movieStateService.add(payload).pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe({
      next: created => this.router.navigate(['/movies', created.id]),
      error: () => {
        this.errorMsg = 'Failed to save movie, please try again.';
      }
    });
  }
}

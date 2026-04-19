import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DirectorService } from '../../services/director.service';

@Component({
  selector: 'app-director-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="director-list-shell">
      <header>
        <p class="kicker">Director Library</p>
        <h1>Directors</h1>
        <p>Browse directors and jump directly to their filmography.</p>
      </header>

      <div class="director-grid" *ngIf="directors$ | async as directors">
        <a
          *ngFor="let director of directors"
          class="director-card"
          [routerLink]="['/directors', director.id]"
        >
          <h3>{{ director.name }}</h3>
          <p>{{ director.nationality }}</p>
          <span>Born {{ director.birthYear }}</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .director-list-shell {
      max-width: 1280px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1rem;
    }

    header {
      padding: 1.25rem;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      color: #fff8e7;
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
      font-size: 2rem;
    }

    header p:last-child {
      margin: 0;
      color: rgba(255, 248, 225, 0.72);
    }

    .director-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }

    .director-card {
      display: grid;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: 20px;
      text-decoration: none;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(10, 13, 22, 0.9);
      color: #fff8e7;
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .director-card:hover {
      transform: translateY(-2px);
      background:
        linear-gradient(180deg, rgba(246, 216, 120, 0.2), rgba(255, 255, 255, 0.03)),
        rgba(10, 13, 22, 0.95);
    }

    .director-card h3 {
      margin: 0;
    }

    .director-card p {
      margin: 0;
      color: rgba(255, 248, 225, 0.72);
    }

    .director-card span {
      color: #f6d878;
      font-size: 0.85rem;
    }
  `]
})
export class DirectorListComponent {
  private readonly directorService = inject(DirectorService);

  readonly directors$ = this.directorService.getDirectors();
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="about-shell">
      <article class="panel">
        <p class="kicker">About CinemaFlow</p>
        <h1>Route Topology and Service Architecture</h1>
        <p>
          This project demonstrates parameterized routes, cross-entity navigation, route guards,
          and standalone components in Angular.
        </p>
      </article>

      <article class="panel">
        <h2>Current Route Map</h2>
        <pre class="route-map">
/                       -> redirect to /dashboard
/dashboard              -> DashboardComponent
/movies                 -> MovieListComponent
/movies/genre/:genre    -> MovieListComponent (genre filter)
/movies/:id             -> MovieDetailComponent
/directors              -> DirectorListComponent
/directors/:id          -> DirectorDetailComponent
/add                    -> MovieAddComponent (authGuard)
/about                  -> AboutComponent
/**                     -> NotFoundComponent
        </pre>
      </article>

      <article class="panel">
        <h2>Core Services</h2>
        <ul>
          <li><strong>MovieService</strong> - Observable movie data APIs</li>
          <li><strong>DirectorService</strong> - Observable director data APIs</li>
          <li><strong>MessageService</strong> - Service and router event logs</li>
          <li><strong>MovieStateService</strong> - BehaviorSubject state center</li>
          <li><strong>AuthService</strong> - Simple login state for route guard demos</li>
        </ul>
        <p *ngIf="latestMessage$ | async as latestMessage">
          Latest service log: {{ latestMessage }}
        </p>
      </article>

      <div class="action-row">
        <a routerLink="/dashboard">Back to Dashboard</a>
        <a routerLink="/movies">Browse Movies</a>
      </div>
    </section>
  `,
  styles: [`
    .about-shell {
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

    h1,
    h2 {
      margin: 0.5rem 0 0;
    }

    h2 {
      font-size: 1.35rem;
    }

    p {
      margin: 0.85rem 0 0;
      color: rgba(255, 248, 225, 0.74);
      line-height: 1.75;
    }

    .route-map {
      margin: 0.85rem 0 0;
      padding: 0.9rem;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.03);
      color: #fff8e7;
      overflow-x: auto;
      font-size: 0.9rem;
      line-height: 1.55;
    }

    ul {
      margin: 0.85rem 0 0;
      padding-left: 1.2rem;
      color: rgba(255, 248, 225, 0.82);
      display: grid;
      gap: 0.35rem;
    }

    li strong {
      color: #fff8e7;
    }

    .action-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
    }

    .action-row a {
      min-height: 42px;
      padding: 0 1rem;
      border-radius: 999px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      font-weight: 700;
    }

    @media (max-width: 640px) {
      .about-shell {
        padding: 1rem;
      }
    }
  `]
})
export class AboutComponent {
  private readonly messageService = inject(MessageService);

  readonly latestMessage$ = this.messageService.messages$.pipe(
    map(messages => messages[0])
  );
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found-shell">
      <p class="kicker">404</p>
      <h1>Page Not Found</h1>
      <p>The page you requested does not exist or has moved.</p>
      <a routerLink="/dashboard">Back to Dashboard</a>
    </section>
  `,
  styles: [`
    .not-found-shell {
      max-width: 840px;
      margin: 2.5rem auto;
      padding: 2rem;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      text-align: center;
      color: #fff8e7;
    }

    .kicker {
      margin: 0;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 4rem;
      line-height: 1;
      color: #f6d878;
    }

    h1 {
      margin: 0.5rem 0 0;
      font-size: 2rem;
    }

    p {
      margin: 0.75rem 0 0;
      color: rgba(255, 248, 225, 0.72);
    }

    a {
      display: inline-flex;
      margin-top: 1.25rem;
      min-height: 44px;
      align-items: center;
      justify-content: center;
      padding: 0 1.1rem;
      border-radius: 999px;
      text-decoration: none;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      font-weight: 700;
    }
  `]
})
export class NotFoundComponent {}

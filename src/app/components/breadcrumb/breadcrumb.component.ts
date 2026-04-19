import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="breadcrumb" *ngIf="breadcrumbs.length > 0">
      <a routerLink="/dashboard" class="home-link">Home</a>
      <span *ngFor="let item of breadcrumbs; let last = last" class="breadcrumb-item">
        <span class="separator">/</span>
        <a *ngIf="!last" [routerLink]="item.url">{{ item.label }}</a>
        <span *ngIf="last" class="current">{{ item.label }}</span>
      </span>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.2rem;
      padding: 0.9rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.03);
      color: rgba(255, 248, 225, 0.72);
      font-size: 0.95rem;
    }

    .home-link,
    .breadcrumb-item a {
      color: #f6d878;
      text-decoration: none;
    }

    .breadcrumb-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .separator,
    .current {
      color: rgba(255, 248, 225, 0.62);
    }
  `]
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);

  breadcrumbs: BreadcrumbItem[] = [];

  private readonly routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    movies: 'Movies',
    directors: 'Directors',
    genre: 'Genre',
    add: 'Add',
    about: 'About'
  };

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs();
      });

    this.breadcrumbs = this.buildBreadcrumbs();
  }

  private buildBreadcrumbs(): BreadcrumbItem[] {
    const url = this.router.url.split('?')[0];
    const segments = url.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentUrl = '';

    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index];
      currentUrl += `/${segment}`;

      const isId = /^\d+$/.test(segment);
      const previousSegment = index > 0 ? segments[index - 1] : '';
      const label = isId
        ? previousSegment === 'directors'
          ? 'Director Detail'
          : 'Movie Detail'
        : this.routeLabels[segment] || decodeURIComponent(segment);

      breadcrumbs.push({ label, url: currentUrl });
    }

    return breadcrumbs;
  }
}

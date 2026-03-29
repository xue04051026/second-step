import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <nav class="breadcrumb" *ngIf="breadcrumbs.length > 0">
      <a routerLink="/dashboard" class="home-link">
        <mat-icon>home</mat-icon>
      </a>
      <span *ngFor="let item of breadcrumbs; let last = last" class="breadcrumb-item">
        <mat-icon>chevron_right</mat-icon>
        <a *ngIf="!last" [routerLink]="item.url">{{ item.label }}</a>
        <span *ngIf="last" class="current">{{ item.label }}</span>
      </span>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      padding: 12px 24px;
      background-color: #f5f5f5;
      font-size: 14px;
    }
    .home-link {
      color: #666;
      text-decoration: none;
    }
    .breadcrumb-item {
      display: flex;
      align-items: center;
    }
    .breadcrumb-item a {
      color: #1976d2;
      text-decoration: none;
    }
    .breadcrumb-item a:hover {
      text-decoration: underline;
    }
    .breadcrumb-item .current {
      color: #666;
    }
    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin: 0 4px;
    }
  `]
})
export class BreadcrumbComponent {
  private router = inject(Router);

  breadcrumbs: BreadcrumbItem[] = [];

  private routeLabels: { [key: string]: string } = {
    'dashboard': '首页',
    'movies': '电影列表',
    'add': '添加电影',
    'about': '关于'
  };

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs();
      });
  }

  private buildBreadcrumbs(): BreadcrumbItem[] {
    const url = this.router.url;
    const segments = url.split('/').filter(s => s);
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentUrl = '';

    for (const segment of segments) {
      // 跳过查询参数
      if (segment.includes('?')) break;
      currentUrl += `/${segment}`;
      // 如果是数字ID，显示为"详情"
      const label = /^\d+$/.test(segment)
        ? '详情'
        : this.routeLabels[segment] || segment;
      breadcrumbs.push({ label, url: currentUrl });
    }
    return breadcrumbs;
  }
}
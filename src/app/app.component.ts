import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MessagePanelComponent } from './components/message-panel/message-panel.component';
import { MovieStateService } from './services/movie-state.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BreadcrumbComponent, MessagePanelComponent],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <div class="brand-block">
          <span class="brand-mark">CF</span>
          <div>
            <a class="brand-name" routerLink="/dashboard">CinemaFlow</a>
            <p class="brand-subtitle">电影片单管理与展映式浏览体验</p>
          </div>
        </div>

        <nav class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active-link" *ngIf="hasPermission('view_dashboard')">仪表盘</a>
          <a routerLink="/movies" routerLinkActive="active-link" *ngIf="hasPermission('view_movies')">电影列表</a>
          <a routerLink="/add" routerLinkActive="active-link" *ngIf="hasPermission('add_movie')">新增电影</a>
          <a routerLink="/about" routerLinkActive="active-link" *ngIf="hasPermission('view_about')">关于</a>
        </nav>

        <label class="role-switcher">
          <span>当前角色</span>
          <select [value]="currentUser.role" (change)="switchRole($any($event.target).value)">
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
            <option value="guest">访客</option>
          </select>
        </label>
      </header>

      <app-breadcrumb></app-breadcrumb>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <app-message-panel></app-message-panel>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
    }

    .app-header {
      position: sticky;
      top: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.2rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(180deg, rgba(11, 14, 24, 0.96), rgba(11, 14, 24, 0.82)),
        rgba(11, 14, 24, 0.92);
      backdrop-filter: blur(14px);
    }

    .brand-block {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 0;
    }

    .brand-mark {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .brand-name {
      color: #fff8e7;
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      text-decoration: none;
      line-height: 1;
    }

    .brand-subtitle {
      margin: 0.25rem 0 0;
      color: rgba(255, 248, 225, 0.64);
      font-size: 0.85rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .nav-links a {
      padding: 0.75rem 1rem;
      border-radius: 999px;
      color: rgba(255, 248, 225, 0.84);
      text-decoration: none;
      transition: background 0.25s ease, color 0.25s ease;
    }

    .nav-links a:hover,
    .nav-links .active-link {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }

    .role-switcher {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      color: rgba(255, 248, 225, 0.72);
      font-size: 0.82rem;
    }

    .role-switcher select {
      min-width: 124px;
      min-height: 42px;
      padding: 0 0.85rem;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      outline: none;
    }

    .main-content {
      padding-bottom: 2rem;
    }

    @media (max-width: 920px) {
      .app-header {
        flex-direction: column;
        align-items: stretch;
      }

      .nav-links {
        justify-content: flex-start;
      }

      .role-switcher {
        width: fit-content;
      }
    }
  `]
})
export class AppComponent {
  private readonly userService = inject(UserService);
  private readonly movieStateService = inject(MovieStateService);

  currentUser = this.userService.getCurrentUser();

  constructor() {
    this.movieStateService.load();
  }

  hasPermission(permission: string): boolean {
    return this.userService.hasPermission(permission);
  }

  switchRole(role: 'admin' | 'user' | 'guest'): void {
    this.userService.switchRole(role);
    this.currentUser = this.userService.getCurrentUser();
  }
}

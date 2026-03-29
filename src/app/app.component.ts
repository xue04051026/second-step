import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    BreadcrumbComponent
  ],
  template: `
    <!-- 导航栏 -->
    <mat-toolbar color="primary" class="app-toolbar">
      <span class="brand">
        CinemaFlow
      </span>
      <span class="spacer"></span>
      <nav class="nav-links">
        <a class="nav-link" routerLink="/dashboard" routerLinkActive="active-link"
          *ngIf="hasPermission('view_dashboard')">
          仪表盘
        </a>
        <a class="nav-link" routerLink="/movies" routerLinkActive="active-link"
          *ngIf="hasPermission('view_movies')">
          电影列表
        </a>
        <a class="nav-link" routerLink="/add" routerLinkActive="active-link"
          *ngIf="hasPermission('add_movie')">
          添加电影
        </a>
        <a class="nav-link" routerLink="/about" routerLinkActive="active-link"
          *ngIf="hasPermission('view_about')">
          关于
        </a>
      </nav>
      <!-- 用户角色切换 -->
      <mat-form-field class="role-selector">
        <mat-label>用户角色</mat-label>
        <mat-select [value]="currentUser.role" (selectionChange)="switchRole($event.value)">
          <mat-option value="admin">管理员</mat-option>
          <mat-option value="user">普通用户</mat-option>
          <mat-option value="guest">访客</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-toolbar>
    <!-- 面包屑导航 -->
    <app-breadcrumb></app-breadcrumb>
    <!-- 页面内容区域 -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    .brand {
      font-size: 1.2rem;
      font-weight: 500;
    }
    .spacer {
      flex: 1;
    }
    .nav-links {
      display: flex;
      gap: 16px;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
      font-size: 14px;
    }
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .active-link {
      background-color: rgba(255, 255, 255, 0.2);
    }
    .role-selector {
      margin-left: 16px;
      width: 120px;
    }
    .role-selector ::ng-deep .mat-form-field-wrapper {
      padding-bottom: 0;
    }
    .role-selector ::ng-deep .mat-form-field-underline {
      background-color: rgba(255, 255, 255, 0.3);
    }
    .role-selector ::ng-deep .mat-form-field-label,
    .role-selector ::ng-deep .mat-select-value {
      color: white;
    }
    .main-content {
      padding-top: 64px;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class AppComponent {
  private userService = inject(UserService);
  
  currentUser = this.userService.getCurrentUser();

  hasPermission(permission: string): boolean {
    return this.userService.hasPermission(permission);
  }

  switchRole(role: 'admin' | 'user' | 'guest'): void {
    this.userService.switchRole(role);
    this.currentUser = this.userService.getCurrentUser();
  }
}
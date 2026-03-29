import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">关于 CinemaFlow</h1>
      <mat-card class="about-card">
        <mat-card-header>
          <mat-card-title class="card-title">CinemaFlow 电影管理系统</mat-card-title>
          <mat-card-subtitle class="card-subtitle">v1.0.0</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="card-content">
          <p class="description">
            CinemaFlow 是一个基于 Angular 开发的单页面应用，用于管理个人观影记录。
            该系统提供了完整的电影管理功能，包括添加、编辑、删除电影，以及搜索和筛选功能。
          </p>
          
          <h3 class="section-title">主要功能</h3>
          <ul class="feature-list">
            <li>电影列表展示与管理</li>
            <li>添加新电影信息</li>
            <li>电影详情查看</li>
            <li>搜索和筛选功能</li>
            <li>观影状态跟踪</li>
            <li>评分管理系统</li>
          </ul>
          
          <h3 class="section-title">技术栈</h3>
          <ul class="tech-list">
            <li><strong>Angular 17+</strong> - 使用独立组件架构</li>
            <li><strong>Angular Material UI</strong> - Material Design 风格组件库</li>
            <li><strong>TypeScript</strong> - 类型安全的 JavaScript 超集</li>
            <li><strong>Angular Router</strong> - 单页面应用路由管理</li>
            <li><strong>RxJS</strong> - 响应式编程库</li>
          </ul>
          
          <h3 class="section-title">开发团队</h3>
          <p class="team-info">
            本项目由 CinemaFlow 开发团队精心打造，致力于为用户提供最佳的电影管理体验。
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .page-title {
      font-size: 32px;
      font-weight: 600;
      color: #333;
      margin-bottom: 24px;
    }
    .about-card {
      margin-top: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .card-title {
      font-size: 24px;
      font-weight: 600;
      color: #1976d2;
      margin-bottom: 8px;
    }
    .card-subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 16px;
    }
    .card-content {
      padding: 24px;
    }
    .description {
      font-size: 16px;
      line-height: 1.8;
      color: #333;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #1976d2;
      margin-top: 24px;
      margin-bottom: 16px;
      border-bottom: 2px solid #1976d2;
      padding-bottom: 8px;
    }
    .feature-list, .tech-list {
      padding-left: 24px;
      margin-bottom: 24px;
    }
    .feature-list li, .tech-list li {
      font-size: 15px;
      line-height: 2;
      color: #333;
      margin-bottom: 8px;
    }
    .tech-list li strong {
      color: #1976d2;
    }
    .team-info {
      font-size: 15px;
      line-height: 1.8;
      color: #666;
      font-style: italic;
    }
  `]
})
export class AboutComponent {}
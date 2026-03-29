import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { RatingLevelPipe } from '../../pipes/rating-level.pipe';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    RatingLevelPipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>电影列表</h1>
        <a class="add-btn" routerLink="/add">
          添加电影
        </a>
      </div>
      
      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <!-- 搜索框 -->
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>搜索电影</mat-label>
          <input matInput [(ngModel)]="searchTerm"
            (keyup.enter)="applyFilters()"
            placeholder="输入电影名称或导演">
          <button class="search-btn" (click)="applyFilters()">
            搜索
          </button>
        </mat-form-field>
        
        <!-- 筛选和排序选项 -->
        <div class="filter-options">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>观影状态</mat-label>
            <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
              <mat-option value="">全部</mat-option>
              <mat-option value="watched">已观影</mat-option>
              <mat-option value="unwatched">未观影</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>评分范围</mat-label>
            <mat-select [(ngModel)]="ratingFilter" (selectionChange)="applyFilters()">
              <mat-option value="">全部</mat-option>
              <mat-option value="high">高分 (8分以上)</mat-option>
              <mat-option value="medium">中等 (6-8分)</mat-option>
              <mat-option value="low">低分 (6分以下)</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="sort-field">
            <mat-label>排序方式</mat-label>
            <mat-select [(ngModel)]="sortBy" (selectionChange)="applyFilters()">
              <mat-option value="title">按名称</mat-option>
              <mat-option value="rating">按评分</mat-option>
              <mat-option value="releaseDate">按上映日期</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="order-field">
            <mat-label>排序顺序</mat-label>
            <mat-select [(ngModel)]="sortOrder" (selectionChange)="applyFilters()">
              <mat-option value="asc">升序</mat-option>
              <mat-option value="desc">降序</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <!-- 当前筛选条件显示 -->
        <div class="active-filters" *ngIf="hasActiveFilters()">
          <span class="filter-label">当前筛选：</span>
          <mat-chip-listbox>
            <mat-chip *ngIf="searchTerm" (removed)="clearSearch()">
              搜索: {{ searchTerm }}
              <span matChipRemove>×</span>
            </mat-chip>
            <mat-chip *ngIf="statusFilter" (removed)="clearStatusFilter()">
              状态: {{ statusFilter === 'watched' ? '已观影' : '未观影' }}
              <span matChipRemove>×</span>
            </mat-chip>
            <mat-chip *ngIf="ratingFilter" (removed)="clearRatingFilter()">
              评分: {{ getRatingFilterLabel() }}
              <span matChipRemove>×</span>
            </mat-chip>
          </mat-chip-listbox>
          <button class="clear-all-btn" (click)="clearAllFilters()">清除全部</button>
        </div>
      </div>
      
      <!-- 电影列表表格 -->
      <table mat-table [dataSource]="filteredMovies" class="movie-table">
        <!-- 海报列 -->
        <ng-container matColumnDef="poster">
          <th mat-header-cell *matHeaderCellDef>海报</th>
          <td mat-cell *matCellDef="let movie">
            <img class="poster-thumb" [src]="movie.posterUrl || '/picture/' + movie.id + '.jpg'" [alt]="movie.title" />
          </td>
        </ng-container>
        <!-- 标题列 -->
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>电影名称</th>
          <td mat-cell *matCellDef="let movie">
            <a [routerLink]="['/movies', movie.id]" class="movie-link">
              {{ movie.title }}
            </a>
          </td>
        </ng-container>
        <!-- 导演列 -->
        <ng-container matColumnDef="director">
          <th mat-header-cell *matHeaderCellDef>导演</th>
          <td mat-cell *matCellDef="let movie">{{ movie.director }}</td>
        </ng-container>
        <!-- 评分列 -->
        <ng-container matColumnDef="rating">
          <th mat-header-cell *matHeaderCellDef>评分</th>
          <td mat-cell *matCellDef="let movie">
            <span class="rating-badge" [class.high]="movie.rating >= 8">
              {{ movie.rating }}
            </span>
            <span class="rating-level">({{ movie.rating | ratingLevel }})</span>
          </td>
        </ng-container>
        <!-- 状态列 -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>状态</th>
          <td mat-cell *matCellDef="let movie">
            <span class="status-badge" [class.watched]="movie.isWatched">
              {{ movie.isWatched ? '已观影' : '未观影' }}
            </span>
          </td>
        </ng-container>
        <!-- 操作列 -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>操作</th>
          <td mat-cell *matCellDef="let movie">
            <a class="action-btn view-btn"
              [routerLink]="['/movies', movie.id]">
              查看详情
            </a>
            <button class="action-btn delete-btn"
              (click)="deleteMovie(movie.id)">
              删除
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      
      <!-- 无搜索结果提示 -->
      <div *ngIf="filteredMovies.length === 0" class="no-results">
        <p>没有找到匹配的电影</p>
        <button class="clear-btn" (click)="clearAllFilters()">清除筛选</button>
      </div>
      
      <!-- 结果统计 -->
      <div class="results-info" *ngIf="filteredMovies.length > 0">
        显示 {{ filteredMovies.length }} 部电影（共 {{ allMovies.length }} 部）
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .add-btn {
      background-color: #1976d2;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 14px;
    }
    .add-btn:hover {
      background-color: #1565c0;
    }
    .filter-section {
      margin-bottom: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }
    .search-field {
      width: 100%;
      margin-bottom: 16px;
    }
    .search-field ::ng-deep .mat-form-field-outline {
      background-color: white;
      border-radius: 8px;
    }
    .search-field ::ng-deep .mat-form-field-outline-thick {
      color: #1976d2;
    }
    .search-btn {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 6px;
      cursor: pointer;
      margin-left: 8px;
      font-weight: 500;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
      transition: all 0.3s ease;
    }
    .search-btn:hover {
      background-color: #1565c0;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
      transform: translateY(-1px);
    }
    .filter-options {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .filter-options ::ng-deep .mat-form-field-outline {
      background-color: white;
      border-radius: 8px;
    }
    .filter-field, .sort-field, .order-field {
      flex: 1;
      min-width: 150px;
    }
    .active-filters {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding: 12px;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .filter-label {
      font-weight: 500;
      color: #666;
    }
    .clear-all-btn {
      background-color: #666;
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .movie-table {
      width: 100%;
    }
    .movie-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }
    .movie-link:hover {
      text-decoration: underline;
    }
    .rating-badge {
      background-color: #e0e0e0;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 500;
    }
    .rating-badge.high {
      background-color: #4caf50;
      color: white;
    }
    .rating-level {
      margin-left: 8px;
      color: #666;
      font-size: 0.9em;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      background-color: #e0e0e0;
    }
    .status-badge.watched {
      background-color: #4caf50;
      color: white;
    }
    .poster-thumb {
      width: 64px;
      height: 96px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #eee;
    }
    .no-results {
      text-align: center;
      padding: 48px;
      color: #666;
    }
    .clear-btn {
      background-color: #666;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .results-info {
      text-align: center;
      padding: 16px;
      color: #666;
      font-size: 14px;
    }
    .action-btn {
      padding: 4px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      margin-right: 8px;
      text-decoration: none;
    }
    .view-btn {
      background-color: #1976d2;
      color: white;
    }
    .view-btn:hover {
      background-color: #1565c0;
    }
    .delete-btn {
      background-color: #d32f2f;
      color: white;
    }
    .delete-btn:hover {
      background-color: #c62828;
    }
  `]
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchTerm = '';
  statusFilter = '';
  ratingFilter = '';
  sortBy = 'title';
  sortOrder = 'asc';
  
  displayedColumns = ['poster', 'title', 'director', 'rating', 'status', 'actions'];
  
  allMovies = this.movieService.getMovies();
  filteredMovies: Movie[] = this.allMovies;

  ngOnInit(): void {
    // 从URL查询参数中读取状态
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.statusFilter = params['status'] || '';
      this.ratingFilter = params['rating'] || '';
      this.sortBy = params['sortBy'] || 'title';
      this.sortOrder = params['sortOrder'] || 'asc';
      this.applyFiltersWithoutNavigation();
    });
  }

  private applyFiltersWithoutNavigation(): void {
    let result = [...this.allMovies];

    // 搜索过滤
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(term) ||
        movie.director.toLowerCase().includes(term)
      );
    }

    // 状态过滤
    if (this.statusFilter) {
      const isWatched = this.statusFilter === 'watched';
      result = result.filter(movie => movie.isWatched === isWatched);
    }

    // 评分过滤
    if (this.ratingFilter) {
      result = result.filter(movie => {
        if (this.ratingFilter === 'high') return movie.rating >= 8;
        if (this.ratingFilter === 'medium') return movie.rating >= 6 && movie.rating < 8;
        if (this.ratingFilter === 'low') return movie.rating < 6;
        return true;
      });
    }

    // 排序
    result.sort((a, b) => {
      let comparison = 0;
      if (this.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (this.sortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else if (this.sortBy === 'releaseDate') {
        comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredMovies = result;
  }

  applyFilters(): void {
    this.applyFiltersWithoutNavigation();
    
    // 更新URL查询参数
    const queryParams: any = {};
    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.statusFilter) queryParams.status = this.statusFilter;
    if (this.ratingFilter) queryParams.rating = this.ratingFilter;
    if (this.sortBy !== 'title') queryParams.sortBy = this.sortBy;
    if (this.sortOrder !== 'asc') queryParams.sortOrder = this.sortOrder;

    this.router.navigate(['/movies'], { queryParams });
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.statusFilter || this.ratingFilter);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  clearStatusFilter(): void {
    this.statusFilter = '';
    this.applyFilters();
  }

  clearRatingFilter(): void {
    this.ratingFilter = '';
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.ratingFilter = '';
    this.sortBy = 'title';
    this.sortOrder = 'asc';
    this.router.navigate(['/movies']);
  }

  getRatingFilterLabel(): string {
    switch (this.ratingFilter) {
      case 'high': return '高分 (8分以上)';
      case 'medium': return '中等 (6-8分)';
      case 'low': return '低分 (6分以下)';
      default: return '';
    }
  }

  deleteMovie(id: number): void {
    if (confirm('确定要删除这部电影吗？')) {
      this.movieService.deleteMovie(id);
      this.allMovies = this.movieService.getMovies();
      this.applyFiltersWithoutNavigation();
    }
  }
}
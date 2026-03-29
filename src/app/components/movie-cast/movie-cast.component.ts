import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-cast',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>演员表</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          <mat-list-item *ngFor="let actor of cast">
            <mat-icon matListIcon>person</mat-icon>
            <div matListItemTitle>{{ actor.name }}</div>
            <div matListItemLine>{{ actor.role }}</div>
          </mat-list-item>
        </mat-list>
        <div *ngIf="cast.length === 0" class="no-cast">
          <mat-icon>info</mat-icon>
          <p>暂无演员信息</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .no-cast {
      text-align: center;
      padding: 24px;
      color: #666;
    }
    .no-cast mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class MovieCastComponent {
  @Input() movie?: Movie;

  // 模拟演员数据 - 在实际应用中，这应该从服务获取
  get cast(): { name: string; role: string }[] {
    // 这里可以根据电影ID返回不同的演员数据
    const mockCast = [
      { name: '演员A', role: '主角' },
      { name: '演员B', role: '配角' },
      { name: '演员C', role: '配角' }
    ];
    return mockCast;
  }
}
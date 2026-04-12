import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { MovieStateService } from '../../services/movie-state.service';

@Component({
  selector: 'app-movie-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-shell" *ngIf="stats$ | async as stats">
      <div class="stats-header">
        <div>
          <p class="eyebrow">Cinema Intelligence</p>
          <h2>观影数据总览</h2>
        </div>
        <p class="stats-note">从片单规模到观影完成度，一眼看清你的影库节奏。</p>
      </div>

      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-kicker">片库总量</span>
          <strong>{{ stats.totalMovies }}</strong>
          <span>部精选电影</span>
        </article>

        <article class="stat-card">
          <span class="stat-kicker">已观影</span>
          <strong>{{ stats.watchedMovies }}</strong>
          <span>完成率 {{ stats.watchedPercentage | number: '1.0-0' }}%</span>
        </article>

        <article class="stat-card">
          <span class="stat-kicker">平均评分</span>
          <strong>{{ stats.averageRating | number: '1.1-1' }}</strong>
          <span>{{ stats.ratingMood }}</span>
        </article>

        <article class="stat-card accent-card">
          <span class="stat-kicker">最高分影片</span>
          <strong>{{ stats.topRatedMovieTitle }}</strong>
          <span>{{ stats.topRatedMovieRating }}</span>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .stats-shell {
      padding: 1.8rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 28px;
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        radial-gradient(circle at top right, rgba(212, 175, 55, 0.18), transparent 30%),
        rgba(9, 11, 20, 0.88);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(14px);
    }

    .stats-header {
      display: flex;
      justify-content: space-between;
      gap: 1.5rem;
      align-items: end;
      margin-bottom: 1.5rem;
    }

    .stats-header h2 {
      margin: 0.25rem 0 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 3vw, 2.8rem);
      color: #fff7df;
    }

    .eyebrow,
    .stats-note,
    .stat-kicker,
    .stat-card span {
      color: rgba(255, 248, 225, 0.72);
    }

    .eyebrow {
      margin: 0;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    .stats-note {
      max-width: 24rem;
      margin: 0;
      line-height: 1.7;
      text-align: right;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      min-height: 152px;
      padding: 1.35rem;
      border-radius: 22px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
    }

    .stat-card strong {
      color: #fff;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(2.3rem, 4vw, 3.4rem);
      line-height: 1;
      letter-spacing: 0.03em;
    }

    .accent-card {
      background:
        linear-gradient(180deg, rgba(212, 175, 55, 0.18), rgba(255, 255, 255, 0.03)),
        rgba(15, 17, 29, 0.95);
    }

    @media (max-width: 960px) {
      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .stats-header {
        flex-direction: column;
        align-items: start;
      }

      .stats-note {
        text-align: left;
      }
    }

    @media (max-width: 640px) {
      .stats-shell {
        padding: 1.2rem;
        border-radius: 22px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieStatsComponent {
  private readonly movieStateService = inject(MovieStateService);

  readonly stats$ = this.movieStateService.movies$.pipe(
    map(movies => {
      const totalMovies = movies.length;
      const watchedMovies = movies.filter(movie => movie.isWatched).length;
      const averageRating = totalMovies === 0
        ? 0
        : movies.reduce((sum, movie) => sum + movie.rating, 0) / totalMovies;
      const topRatedMovie = totalMovies > 0
        ? [...movies].sort((a, b) => b.rating - a.rating)[0]
        : undefined;

      return {
        totalMovies,
        watchedMovies,
        watchedPercentage: totalMovies === 0 ? 0 : (watchedMovies / totalMovies) * 100,
        averageRating,
        topRatedMovieTitle: topRatedMovie ? topRatedMovie.title : '暂无电影',
        topRatedMovieRating: topRatedMovie ? `${topRatedMovie.rating} 分` : '等待片单加载',
        ratingMood: this.getRatingMood(averageRating)
      };
    })
  );

  private getRatingMood(average: number): string {
    if (average >= 9) {
      return '整体品味偏向殿堂级经典';
    }

    if (average >= 8) {
      return '片单稳定保持高口碑水准';
    }

    return '还在持续扩充片单中';
  }
}

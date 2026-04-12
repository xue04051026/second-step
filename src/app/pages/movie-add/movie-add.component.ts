import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieStateService } from '../../services/movie-state.service';

@Component({
  selector: 'app-movie-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="add-shell">
      <section class="intro-panel">
        <div>
          <p class="eyebrow">New Entry</p>
          <h1>把下一张海报，加入你的展映墙</h1>
          <p class="intro-text">
            新增页现在支持更完整的电影信息录入，并且可以实时预览海报，避免保存后才发现图片失效。
          </p>
        </div>

        <div class="preview-card">
          <div class="preview-poster">
            <img
              [src]="posterPreviewUrl"
              [alt]="newMovie.title || '海报预览'"
              (error)="onPosterError()"
              (load)="onPosterLoad()"
            />
            <span class="preview-badge">{{ (newMovie.rating || 0).toFixed(1) }}</span>
          </div>

          <div class="preview-body">
            <h2>{{ newMovie.title || '未命名电影' }}</h2>
            <p>{{ newMovie.director || '等待录入导演信息' }}</p>
            <span class="preview-meta">
              {{ newMovie.genre || '类型待定' }}
            </span>
            <small *ngIf="posterState === 'error'">当前海报链接无法加载，保存后会自动使用默认海报。</small>
            <small *ngIf="posterState === 'loading'">正在尝试加载海报预览…</small>
            <small *ngIf="posterState === 'loaded'">海报预览已成功加载。</small>
          </div>
        </div>
      </section>

      <section class="form-panel">
        <form #movieForm="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <label class="field full-span">
              <span>电影名称</span>
              <input [(ngModel)]="newMovie.title" name="title" required placeholder="例如：海上钢琴师" />
            </label>

            <label class="field">
              <span>导演</span>
              <input [(ngModel)]="newMovie.director" name="director" required placeholder="输入导演姓名" />
            </label>

            <label class="field">
              <span>上映日期</span>
              <input [(ngModel)]="releaseDateInput" name="releaseDate" type="date" />
            </label>

            <label class="field">
              <span>类型</span>
              <input [(ngModel)]="newMovie.genre" name="genre" placeholder="剧情 / 爱情 / 犯罪" />
            </label>

            <label class="field">
              <span>国家 / 地区</span>
              <input [(ngModel)]="newMovie.country" name="country" placeholder="中国大陆 / 美国 / 日本" />
            </label>

            <label class="field">
              <span>语言</span>
              <input [(ngModel)]="newMovie.language" name="language" placeholder="汉语普通话 / 英语" />
            </label>

            <label class="field">
              <span>片长（分钟）</span>
              <input [(ngModel)]="runtimeInput" name="runtime" type="number" min="1" placeholder="120" />
            </label>

            <label class="field">
              <span>评分</span>
              <input [(ngModel)]="newMovie.rating" name="rating" type="range" min="0" max="10" step="0.1" />
              <strong class="range-value">{{ (newMovie.rating || 0).toFixed(1) }}</strong>
            </label>

            <label class="field full-span">
              <span>一句话文案</span>
              <input [(ngModel)]="newMovie.tagline" name="tagline" placeholder="一句更像海报文案的简介" />
            </label>

            <label class="field full-span">
              <span>电影简介</span>
              <textarea [(ngModel)]="newMovie.summary" name="summary" rows="4" placeholder="写一段适合卡片与详情页展示的简介"></textarea>
            </label>

            <label class="field full-span">
              <span>海报 URL</span>
              <input
                [(ngModel)]="newMovie.posterUrl"
                name="posterUrl"
                placeholder="https://..."
                (input)="resetPosterState()"
              />
            </label>

            <label class="toggle-field full-span">
              <input [(ngModel)]="newMovie.isWatched" name="isWatched" type="checkbox" />
              <span>已经看过这部电影</span>
            </label>
          </div>

          <div class="action-row">
            <a routerLink="/movies" class="ghost-action">返回列表</a>
            <button type="submit" class="primary-action" [disabled]="!movieForm.form.valid || saving">
              {{ saving ? '保存中...' : '保存电影' }}
            </button>
          </div>

          <p class="form-error" *ngIf="errorMsg">{{ errorMsg }}</p>
        </form>
      </section>
    </div>
  `,
  styles: [`
    .add-shell {
      max-width: 1360px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1.5rem;
    }

    .intro-panel,
    .form-panel {
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(16px);
    }

    .intro-panel {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(280px, 380px);
      gap: 1.2rem;
      padding: clamp(1.4rem, 3vw, 2.4rem);
    }

    .eyebrow,
    .intro-text,
    .preview-body p,
    .preview-meta,
    .preview-body small,
    .field span,
    .toggle-field span {
      color: rgba(255, 248, 225, 0.74);
    }

    .eyebrow {
      margin: 0 0 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      font-size: 0.78rem;
    }

    .intro-panel h1,
    .preview-body h2 {
      margin: 0;
      color: #fff8e7;
      font-family: 'Cormorant Garamond', serif;
    }

    .intro-panel h1 {
      font-size: clamp(2.7rem, 5vw, 4.6rem);
      line-height: 0.95;
      max-width: 11ch;
    }

    .intro-text {
      max-width: 46rem;
      margin: 1rem 0 0;
      line-height: 1.85;
    }

    .preview-card {
      overflow: hidden;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .preview-poster {
      position: relative;
      aspect-ratio: 2 / 3;
      background: linear-gradient(180deg, #2d2417, #111);
    }

    .preview-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .preview-badge {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      min-width: 68px;
      min-height: 68px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(7, 8, 12, 0.84);
      color: #f6d878;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.8rem;
      backdrop-filter: blur(8px);
    }

    .preview-body {
      padding: 1.2rem;
      display: grid;
      gap: 0.5rem;
    }

    .preview-body p,
    .preview-body h2,
    .preview-body small {
      margin: 0;
    }

    .preview-meta {
      font-size: 0.92rem;
    }

    .form-panel {
      padding: 1.4rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .field,
    .toggle-field {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .full-span {
      grid-column: 1 / -1;
    }

    .field input,
    .field textarea {
      width: 100%;
      min-height: 52px;
      padding: 0.9rem 1rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      outline: none;
    }

    .field input[type="range"] {
      padding: 0;
      accent-color: #d4af37;
    }

    .field textarea {
      min-height: 132px;
      resize: vertical;
    }

    .field input::placeholder,
    .field textarea::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }

    .range-value {
      color: #f6d878;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 2rem;
      line-height: 1;
    }

    .toggle-field {
      flex-direction: row;
      align-items: center;
      padding: 1rem 1.1rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .toggle-field input {
      width: 18px;
      height: 18px;
      accent-color: #d4af37;
    }

    .action-row {
      display: flex;
      justify-content: flex-end;
      gap: 0.9rem;
      margin-top: 1.4rem;
      flex-wrap: wrap;
    }

    .ghost-action,
    .primary-action {
      min-height: 48px;
      padding: 0 1.2rem;
      border-radius: 999px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s ease;
    }

    .ghost-action {
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #fff8e7;
      background: rgba(255, 255, 255, 0.04);
    }

    .primary-action {
      border: none;
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #16130a;
      font-weight: 700;
      cursor: pointer;
    }

    .primary-action:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .form-error {
      margin: 1rem 0 0;
      color: #ffb8b8;
      text-align: right;
    }

    .ghost-action:hover,
    .primary-action:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    @media (max-width: 960px) {
      .intro-panel {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 720px) {
      .add-shell {
        padding: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieAddComponent {
  private readonly movieStateService = inject(MovieStateService);
  private readonly router = inject(Router);

  readonly defaultPoster = '/assets/default-poster.jpg';

  posterState: 'idle' | 'loading' | 'loaded' | 'error' = 'idle';
  saving = false;
  errorMsg = '';

  newMovie: Partial<Movie> = {
    title: '',
    director: '',
    releaseDate: new Date(),
    rating: 7.0,
    isWatched: false,
    posterUrl: '',
    genre: '',
    runtime: undefined,
    country: '',
    language: '',
    tagline: '',
    summary: ''
  };

  get releaseDateInput(): string {
    if (!this.newMovie.releaseDate) {
      return '';
    }

    const date = new Date(this.newMovie.releaseDate);
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  set releaseDateInput(value: string) {
    this.newMovie.releaseDate = value ? new Date(value) : new Date();
  }

  get runtimeInput(): number | null {
    return this.newMovie.runtime ?? null;
  }

  set runtimeInput(value: number | null) {
    this.newMovie.runtime = value ?? undefined;
  }

  get posterPreviewUrl(): string {
    return this.newMovie.posterUrl || this.defaultPoster;
  }

  resetPosterState(): void {
    this.posterState = this.newMovie.posterUrl ? 'loading' : 'idle';
  }

  onPosterLoad(): void {
    this.posterState = 'loaded';
  }

  onPosterError(): void {
    this.posterState = 'error';
  }

  onSubmit(): void {
    if (!this.newMovie.title || !this.newMovie.director) {
      return;
    }

    this.saving = true;
    this.errorMsg = '';

    this.movieStateService.add({
      title: this.newMovie.title || '',
      director: this.newMovie.director || '',
      releaseDate: this.newMovie.releaseDate || new Date(),
      rating: this.newMovie.rating || 0,
      isWatched: !!this.newMovie.isWatched,
      posterUrl: this.newMovie.posterUrl || this.defaultPoster,
      genre: this.newMovie.genre || '',
      runtime: this.newMovie.runtime,
      country: this.newMovie.country || '',
      language: this.newMovie.language || '',
      tagline: this.newMovie.tagline || '',
      summary: this.newMovie.summary || ''
    }).pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe({
      next: created => this.router.navigate(['/movies', created.id]),
      error: error => {
        this.errorMsg = '添加失败，请稍后重试';
        console.error(error);
      }
    });
  }
}

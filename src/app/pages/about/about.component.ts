import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="about-shell">
      <section class="about-hero">
        <div class="hero-copy">
          <p class="eyebrow">About CinemaFlow</p>
          <h1>把个人片单做成一张更有审美、更有叙事感的电影地图。</h1>
          <p class="hero-text">
            CinemaFlow 不是单纯的电影管理工具，我们希望它像一张会呼吸的展映目录，
            既能记录观影，也能让每一部电影以更体面的方式被看见。
          </p>

          <div class="hero-actions">
            <a class="primary-action" routerLink="/movies">浏览电影列表</a>
            <a class="ghost-action" routerLink="/add">新增一部电影</a>
          </div>
        </div>

        <article class="manifest-card">
          <span class="manifest-label">Design Manifesto</span>
          <h2>电影感、信息感、收藏感</h2>
          <p>
            我们把“海报氛围、片单管理、详情浏览、数据概览”放在同一套视觉语言里，
            让影库既好看，也足够实用。
          </p>
        </article>
      </section>

      <section class="about-grid">
        <article class="panel feature-panel">
          <div class="panel-heading">
            <p class="panel-kicker">Core Features</p>
            <h3>你可以在这里做什么</h3>
          </div>

          <div class="feature-list">
            <div class="feature-item">
              <strong>电影海报墙</strong>
              <span>用更接近流媒体首页的方式浏览片单，而不是普通后台列表。</span>
            </div>
            <div class="feature-item">
              <strong>观影信息管理</strong>
              <span>记录片名、导演、年份、语言、片长、评分和观影状态。</span>
            </div>
            <div class="feature-item">
              <strong>筛选与排序</strong>
              <span>按评分、时间和观影状态快速切换不同视角的电影库。</span>
            </div>
            <div class="feature-item">
              <strong>详情沉浸浏览</strong>
              <span>每一部电影都能以海报主视觉和信息卡片的形式展开。</span>
            </div>
          </div>
        </article>

        <article class="panel tech-panel">
          <div class="panel-heading">
            <p class="panel-kicker">Tech Stack</p>
            <h3>这套前端如何构成</h3>
          </div>

          <div class="tech-tags">
            <span>Angular 18</span>
            <span>Standalone Components</span>
            <span>TypeScript</span>
            <span>Angular Router</span>
            <span>RxJS Observable</span>
            <span>BehaviorSubject</span>
            <span>SCSS</span>
            <span>Responsive Layout</span>
          </div>

          <div class="tech-copy">
            <p>
              整个项目围绕独立组件、路由拆分和统一视觉变量来组织，方便继续扩展新的页面、
              新的电影卡片和更完整的片单数据。
            </p>
          </div>

          <div class="service-box">
            <strong>服务化架构</strong>
            <ul>
              <li>MovieService：提供电影数据的 Observable 接口</li>
              <li>MessageService：记录业务消息日志</li>
              <li>MovieStateService：BehaviorSubject 响应式状态中心</li>
            </ul>
            <p *ngIf="latestMessage$ | async as latestMessage">
              最近一条服务消息：{{ latestMessage }}
            </p>
          </div>
        </article>
      </section>

      <section class="timeline-panel">
        <div class="panel-heading">
          <p class="panel-kicker">Experience Flow</p>
          <h3>从进入首页到保存电影，体验是一条连贯的放映线</h3>
        </div>

        <div class="timeline">
          <div class="timeline-item">
            <strong>01</strong>
            <h4>在仪表盘快速进入</h4>
            <p>先看推荐、本周主推和片库节奏，再决定从哪里开始浏览。</p>
          </div>
          <div class="timeline-item">
            <strong>02</strong>
            <h4>在电影列表中筛选</h4>
            <p>从海报墙里按评分、状态、时间找到最想打开的那一部。</p>
          </div>
          <div class="timeline-item">
            <strong>03</strong>
            <h4>在详情页沉浸阅读</h4>
            <p>通过主海报、文案和信息分区更自然地查看一部电影的内容。</p>
          </div>
          <div class="timeline-item">
            <strong>04</strong>
            <h4>在新增页补全片单</h4>
            <p>录入电影资料并预览海报，把新的收藏稳定加入自己的影库。</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-shell {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
      display: grid;
      gap: 1.5rem;
    }

    .about-hero,
    .panel,
    .timeline-panel {
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        rgba(8, 11, 19, 0.9);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(16px);
    }

    .about-hero {
      display: grid;
      grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.8fr);
      gap: 1.2rem;
      padding: clamp(1.4rem, 4vw, 3rem);
      position: relative;
      overflow: hidden;
    }

    .about-hero::after {
      content: '';
      position: absolute;
      inset: auto -10% -30% 45%;
      height: 280px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.32), transparent 70%);
      pointer-events: none;
    }

    .eyebrow,
    .hero-text,
    .manifest-card p,
    .panel-kicker,
    .feature-item span,
    .tech-copy p,
    .timeline-item p {
      color: rgba(255, 248, 225, 0.74);
    }

    .eyebrow,
    .panel-kicker {
      margin: 0 0 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.24em;
      font-size: 0.78rem;
    }

    .hero-copy h1,
    .manifest-card h2,
    .panel-heading h3,
    .timeline-item h4 {
      margin: 0;
      color: #fff8e7;
      font-family: 'Cormorant Garamond', serif;
    }

    .hero-copy h1 {
      font-size: clamp(3rem, 5vw, 5rem);
      line-height: 0.95;
      max-width: 11ch;
    }

    .hero-text {
      max-width: 48rem;
      margin: 1rem 0 0;
      line-height: 1.85;
      font-size: 1rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      margin-top: 1.5rem;
    }

    .primary-action,
    .ghost-action {
      min-height: 48px;
      padding: 0 1.2rem;
      border-radius: 999px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s ease;
    }

    .primary-action {
      background: linear-gradient(135deg, #d4af37, #f6d878);
      color: #17130a;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
    }

    .ghost-action {
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.05);
      color: #fff8e7;
    }

    .primary-action:hover,
    .ghost-action:hover {
      transform: translateY(-2px);
    }

    .manifest-card {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      justify-content: end;
      gap: 0.8rem;
      padding: 1.5rem;
      border-radius: 24px;
      background:
        linear-gradient(180deg, rgba(212, 175, 55, 0.18), rgba(255, 255, 255, 0.04)),
        rgba(10, 12, 20, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      z-index: 1;
    }

    .manifest-label {
      display: inline-flex;
      width: fit-content;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.1);
      color: #fff8e7;
    }

    .manifest-card h2 {
      font-size: clamp(2rem, 4vw, 3rem);
    }

    .about-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
      gap: 1.5rem;
    }

    .panel,
    .timeline-panel {
      padding: 1.4rem;
    }

    .panel-heading {
      margin-bottom: 1.1rem;
    }

    .feature-list {
      display: grid;
      gap: 1rem;
    }

    .feature-item,
    .timeline-item {
      padding: 1rem 1.05rem;
      border-radius: 22px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.04);
    }

    .feature-item strong,
    .timeline-item strong {
      display: block;
      color: #fff8e7;
      margin-bottom: 0.45rem;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .tech-tags span {
      padding: 0.55rem 0.85rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: #fff8e7;
    }

    .tech-copy {
      margin-top: 1rem;
    }

    .service-box {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 248, 225, 0.82);
    }

    .service-box strong {
      color: #fff8e7;
    }

    .service-box ul {
      margin: 0.75rem 0;
      padding-left: 1.2rem;
    }

    .tech-copy p,
    .service-box p,
    .timeline-item p {
      margin: 0;
      line-height: 1.8;
    }

    .timeline {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .timeline-item strong {
      color: #f6d878;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 2.2rem;
      line-height: 1;
    }

    .timeline-item h4 {
      margin: 0.35rem 0 0.65rem;
      font-size: 1.45rem;
    }

    @media (max-width: 1080px) {
      .about-hero,
      .about-grid,
      .timeline {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 680px) {
      .about-shell {
        padding: 1rem;
      }
    }
  `]
})
export class AboutComponent {
  private readonly messageService = inject(MessageService);

  readonly latestMessage$ = this.messageService.messages$.pipe(
    map(messages => messages[0])
  );
}

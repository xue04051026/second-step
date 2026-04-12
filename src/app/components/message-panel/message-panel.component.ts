import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="message-panel" *ngIf="messageService.messages$ | async as messages">
      <ng-container *ngIf="messages.length">
        <header>
          <div>
            <span class="panel-kicker">Service Log</span>
            <strong>服务消息</strong>
          </div>
          <button type="button" (click)="messageService.clear()" aria-label="清空服务消息">清空</button>
        </header>

        <ul aria-live="polite">
          <li *ngFor="let message of messages">{{ message }}</li>
        </ul>
      </ng-container>
    </aside>
  `,
  styles: [`
    .message-panel {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2000;
      width: min(360px, calc(100vw - 32px));
      max-height: min(320px, calc(100vh - 32px));
      overflow-y: auto;
      border-radius: 8px;
      border: 1px solid rgba(246, 216, 120, 0.28);
      background: rgba(12, 14, 22, 0.94);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(14px);
      color: #fff8e7;
    }

    header {
      position: sticky;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.8rem 0.9rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(12, 14, 22, 0.98);
    }

    header div {
      display: grid;
      gap: 0.2rem;
    }

    .panel-kicker {
      color: rgba(255, 248, 225, 0.58);
      font-size: 0.68rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    button {
      min-height: 34px;
      padding: 0 0.75rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.06);
      color: #fff8e7;
      cursor: pointer;
    }

    ul {
      list-style: none;
      display: grid;
      gap: 0.45rem;
      margin: 0;
      padding: 0.8rem 0.9rem;
    }

    li {
      padding: 0.55rem 0.65rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 248, 225, 0.84);
      font-size: 0.82rem;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
  `]
})
export class MessagePanelComponent {
  readonly messageService = inject(MessageService);
}

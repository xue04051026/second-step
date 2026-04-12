import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly messagesSubject = new BehaviorSubject<string[]>([]);

  readonly messages$ = this.messagesSubject.asObservable();

  get messages(): readonly string[] {
    return this.messagesSubject.value;
  }

  add(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const nextMessages = [`[${timestamp}] ${message}`, ...this.messagesSubject.value].slice(0, 20);
    this.messagesSubject.next(nextMessages);
  }

  clear(): void {
    this.messagesSubject.next([]);
  }
}

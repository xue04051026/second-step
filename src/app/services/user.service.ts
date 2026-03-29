import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({
    id: 1,
    username: '管理员',
    role: 'admin',
    permissions: ['view_dashboard', 'view_movies', 'add_movie', 'view_about']
  });

  currentUser$: Observable<User> = this.currentUserSubject.asObservable();

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user.permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    const user = this.currentUserSubject.value;
    return permissions.some(p => user.permissions.includes(p));
  }

  switchRole(role: 'admin' | 'user' | 'guest'): void {
    const users: { [key: string]: User } = {
      admin: {
        id: 1,
        username: '管理员',
        role: 'admin',
        permissions: ['view_dashboard', 'view_movies', 'add_movie', 'view_about']
      },
      user: {
        id: 2,
        username: '普通用户',
        role: 'user',
        permissions: ['view_dashboard', 'view_movies', 'view_about']
      },
      guest: {
        id: 3,
        username: '访客',
        role: 'guest',
        permissions: ['view_movies']
      }
    };
    this.currentUserSubject.next(users[role]);
  }
}
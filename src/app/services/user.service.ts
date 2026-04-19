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
  private readonly users: Record<User['role'], User> = {
    admin: {
      id: 1,
      username: 'Admin',
      role: 'admin',
      permissions: ['view_dashboard', 'view_movies', 'view_directors', 'add_movie', 'view_about']
    },
    user: {
      id: 2,
      username: 'User',
      role: 'user',
      permissions: ['view_dashboard', 'view_movies', 'view_directors', 'view_about']
    },
    guest: {
      id: 3,
      username: 'Guest',
      role: 'guest',
      permissions: ['view_movies', 'view_directors']
    }
  };

  private readonly currentUserSubject = new BehaviorSubject<User>(this.users.admin);

  readonly currentUser$: Observable<User> = this.currentUserSubject.asObservable();

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user.permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    const user = this.currentUserSubject.value;
    return permissions.some(permission => user.permissions.includes(permission));
  }

  switchRole(role: User['role']): void {
    this.currentUserSubject.next(this.users[role]);
  }
}

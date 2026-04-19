import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = false;

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this._isLoggedIn = true;
      return true;
    }

    return false;
  }

  logout(): void {
    this._isLoggedIn = false;
  }
}

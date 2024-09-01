import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    if (!username || !password) {
      return throwError(() => new Error('Username and password are required.'));
    }
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(user: any): Observable<any> {
    if (!user.username || !user.password || !user.email) {
      return throwError(
        () => new Error('Username, password, and email are required.')
      );
    }
    return this.http.post(`${this.apiUrl}/user`, user);
  }

  promoteToGroupAdmin(userId: number): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('User ID is required.'));
    }
    return this.http.post(`${this.apiUrl}/user/promote`, { userId });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  removeUser(userId: number): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('User ID is required.'));
    }
    return this.http.delete(`${this.apiUrl}/user/${userId}`);
  }

  upgradeToSuperAdmin(userId: number): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('User ID is required.'));
    }
    return this.http.post(`${this.apiUrl}/user/upgrade`, { userId });
  }

  logout(): Observable<any> {
    // Here, we simulate a logout by simply returning an observable
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  deleteAccount(userId: number): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('User ID is required.'));
    }
    return this.http.delete(`${this.apiUrl}/user/${userId}`);
  }
}

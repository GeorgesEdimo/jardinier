import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Utilise le proxy configuré - les requêtes /api/* sont redirigées vers http://localhost:3001
  private baseUrl = '/api';
  private storageKey = 'jardinier_token';

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  clearToken() {
    localStorage.removeItem(this.storageKey);
  }

  async login(email: string, password: string): Promise<void> {
    const res = await this.http
      .post<{ access_token: string }>(`${this.baseUrl}/auth/login`, { email, password })
      .toPromise();
    if (res?.access_token) this.setToken(res.access_token);
  }

  async register(email: string, password: string, name?: string): Promise<void> {
    const res = await this.http
      .post<{ access_token: string }>(`${this.baseUrl}/auth/register`, { email, password, name })
      .toPromise();
    if (res?.access_token) this.setToken(res.access_token);
  }
}

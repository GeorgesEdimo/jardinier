import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  // Utilise le proxy configuré dans proxy.conf.json
  // Les requêtes /api/* seront redirigées vers http://localhost:3001
  private baseUrl = '/api';

  get<T>(path: string): Promise<T> {
    return lastValueFrom(this.http.get<T>(this.baseUrl + path));
  }

  post<T>(path: string, body: any): Promise<T> {
    return lastValueFrom(this.http.post<T>(this.baseUrl + path, body));
  }

  patch<T>(path: string, body: any): Promise<T> {
    return lastValueFrom(this.http.patch<T>(this.baseUrl + path, body));
  }

  delete<T>(path: string): Promise<T> {
    return lastValueFrom(this.http.delete<T>(this.baseUrl + path));
  }

  upload<T>(path: string, file: File): Promise<T> {
    const form = new FormData();
    form.append('file', file);
    return lastValueFrom(this.http.post<T>(this.baseUrl + path, form));
  }
}

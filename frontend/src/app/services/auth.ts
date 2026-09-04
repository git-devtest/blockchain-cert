import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'certificador';
  activo?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = '/api/auth';
  usuarioActual = signal<Usuario | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data, {
      withCredentials: true
    }).pipe(
      tap(res => this.usuarioActual.set(res.usuario))
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.usuarioActual.set(null);
        this.router.navigate(['/login']);
      });
  }

  perfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`, {
      withCredentials: true
    }).pipe(
      tap(usuario => this.usuarioActual.set(usuario))
    );
  }

  recuperarPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recuperar-password`, { email });
  }

  cambiarPassword(token: string, nueva_password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cambiar-password/${token}`, { nueva_password });
  }

  esAdmin(): boolean {
    return this.usuarioActual()?.rol === 'admin';
  }

  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }
}

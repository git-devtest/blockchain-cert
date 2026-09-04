import { Component, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface RegistroAuditoria {
  id: number;
  usuario_id: number;
  rol: string;
  actividad: string;
  detalle: any;
  ip_address: string;
  created_at: string;
  usuario_nombre: string;
  usuario_email: string;
}

@Component({
  selector: 'app-auditoria',
  imports: [],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.scss'
})

export class Auditoria implements OnInit {
  registros = signal<RegistroAuditoria[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.http.get<RegistroAuditoria[]>('/api/admin/auditoria', {
      withCredentials: true
    }).subscribe({
      next: (data) => {
        this.registros.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al cargar auditoría');
        this.cargando.set(false);
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  badgeActividad(actividad: string): string {
    const mapa: Record<string, string> = {
      'LOGIN': 'verde',
      'LOGIN_FALLIDO': 'rojo',
      'LOGOUT': 'gris',
      'CERTIFICAR': 'azul',
      'RECUPERAR_PASSWORD': 'amarillo',
      'CAMBIAR_PASSWORD': 'amarillo',
    };
    return mapa[actividad] || 'gris';
  }
}

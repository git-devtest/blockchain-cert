import { Component, signal, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../services/auth';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})

export class Perfil implements OnInit {
  usuario = signal<Usuario | null>(null);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario.set(this.authService.usuarioActual());
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

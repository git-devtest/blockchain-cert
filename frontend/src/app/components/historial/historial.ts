import { Component, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CertificacionService, Certificacion } from '../../services/certificacion';

@Component({
  selector: 'app-historial',
  imports: [DatePipe],
  templateUrl: './historial.html',
  styleUrl: './historial.scss'
})
export class HistorialComponent implements OnInit {
  certificaciones = signal<Certificacion[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(private certService: CertificacionService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.certService.listar().subscribe({
      next: (data) => {
        this.certificaciones.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al cargar historial');
        this.cargando.set(false);
      }
    });
  }

  polygonscanUrl(txHash: string): string {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  }

  acortarHash(hash: string): string {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  }
}
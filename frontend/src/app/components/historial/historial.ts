import { Component, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CertificacionService, Certificacion } from '../../services/certificacion';
import { StickerService } from '../../services/sticker';

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
  menuAbierto = signal<number | null>(null);

  constructor(
    private certService: CertificacionService,
    private stickerService: StickerService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  toggleMenu(id: number): void {
    this.menuAbierto.set(this.menuAbierto() === id ? null : id);
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

  async descargarSticker(cert: Certificacion): Promise<void> {
    await this.stickerService.generar({
      hash: cert.hash_documento,
      descripcion: cert.descripcion,
      createdAt: cert.created_at!
    });
  }

  verificarUrl(hash: string): string {
    return `/verificar/${hash}`;
  }

  acortarHash(hash: string): string {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  }
}
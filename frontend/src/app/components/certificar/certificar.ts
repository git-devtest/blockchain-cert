import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { CertificacionService, CertificarResponse } from '../../services/certificacion';
import { StickerService } from '../../services/sticker';

type Estado = 'idle' | 'pendiente' | 'confirmado' | 'error';
type Modo = 'texto' | 'archivo';

@Component({
  selector: 'app-certificar',
  imports: [FormsModule],
  templateUrl: './certificar.html',
  styleUrl: './certificar.scss'
})
export class CertificarComponent {
  contenido = signal('');
  descripcion = signal('');
  estado = signal<Estado>('idle');
  resultado = signal<CertificarResponse | null>(null);
  error = signal<string | null>(null);
  modo = signal<Modo>('texto');
  nombreArchivo = signal<string | null>(null);
  bytesArchivo = signal<Uint8Array | null>(null);

  hashPreview = computed(() => {
    if (this.modo() === 'archivo' && this.bytesArchivo()) {
      return bytesToHex(sha256(this.bytesArchivo()!));
    }
    if (this.modo() === 'texto' && this.contenido()) {
      const bytes = new TextEncoder().encode(this.contenido());
      return bytesToHex(sha256(bytes));
    }
    return '';
  });

  constructor(
    private certService: CertificacionService,
    private stickerService: StickerService
  ) {}

  polygonscanUrl(txHash: string): string {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  }

  onArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.nombreArchivo.set(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      this.bytesArchivo.set(new Uint8Array(buffer));
    };
    reader.readAsArrayBuffer(file);
  }

  certificar(): void {
    const hash = this.hashPreview();
    if (!hash || !this.descripcion()) return;

    this.estado.set('pendiente');
    this.error.set(null);
    this.resultado.set(null);

    this.certService.certificar({
      contenido: this.modo() === 'texto' ? this.contenido() : undefined,
      hashPrecalculado: this.modo() === 'archivo' ? hash : undefined,
      descripcion: this.descripcion()
    }).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.estado.set('confirmado');
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error desconocido');
        this.estado.set('error');
      }
    });
  }

  async descargarSticker(): Promise<void> {
    const res = this.resultado();
    if (!res) return;

    await this.stickerService.generar({
      hash: res.hash,
      descripcion: res.data.descripcion,
      createdAt: res.data.created_at!
    });
  }

  reset(): void {
    this.contenido.set('');
    this.descripcion.set('');
    this.estado.set('idle');
    this.resultado.set(null);
    this.error.set(null);
    this.nombreArchivo.set(null);
    this.bytesArchivo.set(null);
  }
}
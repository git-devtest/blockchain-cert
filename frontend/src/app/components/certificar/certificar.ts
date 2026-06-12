import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { CertificacionService, CertificarResponse } from '../../services/certificacion';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

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

  constructor(private certService: CertificacionService) {}

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

    const verUrl = `http://localhost:4200/verificar/${res.hash}`;
    const qrDataUrl = await QRCode.toDataURL(verUrl, { width: 200, margin: 1 });

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [100, 60]
    });

    // Fondo
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 100, 60, 'F');

    // Borde verde
    doc.setDrawColor(15, 110, 86);
    doc.setLineWidth(0.8);
    doc.rect(2, 2, 96, 56);

    // Logo y título
    //doc.setFontSize(11);
    //doc.setFont('helvetica', 'bold');
    //doc.setTextColor(15, 110, 86);
    //doc.text('BLOCKCHAIN CERT', 6, 10);

    // Logo (Icono de bloque/blockchain) y título
    doc.setFillColor(15, 110, 86);
    // Dibuja un pequeño cuadrado redondeado como nodo
    doc.roundedRect(6, 6.5, 4, 4, 1, 1, 'F'); 
    // Un punto blanco en el centro del nodo
    doc.setFillColor(255, 255, 255);
    doc.circle(8, 8.5, 0.6, 'F');

    // Título (Desplazado a la derecha para dar espacio al icono)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 110, 86);
    doc.text('Blockchain Cert', 12, 9.5); // X cambió de 6 a 12

    // Línea separadora
    doc.setDrawColor(15, 110, 86);
    doc.setLineWidth(0.3);
    doc.line(6, 13, 94, 13);

    // Descripción
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Documento:', 6, 20);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(res.data.descripcion, 55);
    doc.text(descLines, 6, 25);

    // Fecha
    const fecha = new Date(res.data.created_at!).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    doc.setFont('helvetica', 'bold');
    doc.text('Certificado:', 6, 35);
    doc.setFont('helvetica', 'normal');
    doc.text(fecha, 6, 40);

    // Hash acortado
    doc.setFont('helvetica', 'bold');
    doc.text('SHA-256:', 6, 47);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`${res.hash.slice(0, 20)}...${res.hash.slice(-8)}`, 6, 51);

    // QR
    doc.addImage(qrDataUrl, 'PNG', 68, 15, 28, 28);

    // Texto bajo QR
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.text('Escanea para verificar', 68, 46);
    doc.text('la autenticidad', 72, 49);

    doc.save(`sticker-${res.hash.slice(0, 8)}.pdf`);
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
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CertificacionService, VerificarResponse } from '../../services/certificacion';

type Estado = 'idle' | 'buscando' | 'encontrado' | 'no_encontrado' | 'error';

@Component({
  selector: 'app-verificar',
  imports: [FormsModule, DatePipe],
  templateUrl: './verificar.html',
  styleUrl: './verificar.scss'
})
export class VerificarComponent {
  hash = signal('');
  estado = signal<Estado>('idle');
  resultado = signal<VerificarResponse | null>(null);
  error = signal<string | null>(null);

  constructor(private certService: CertificacionService) {}

  polygonscanUrl(txHash: string): string {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  }

  verificar(): void {
    if (!this.hash()) return;

    this.estado.set('buscando');
    this.error.set(null);
    this.resultado.set(null);

    this.certService.verificar(this.hash()).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.estado.set(res.existe ? 'encontrado' : 'no_encontrado');
      },
      error: (err) => {
        if (err.status === 404) {
          this.estado.set('no_encontrado');
        } else {
          this.error.set(err.error?.error || 'Error desconocido');
          this.estado.set('error');
        }
      }
    });
  }

  reset(): void {
    this.hash.set('');
    this.estado.set('idle');
    this.resultado.set(null);
    this.error.set(null);
  }
}
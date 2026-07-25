import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CertificacionService, VerificarResponse } from '../../services/certificacion';

type Estado = 'idle' | 'buscando' | 'encontrado' | 'no_encontrado' | 'error';

@Component({
  selector: 'app-verificar',
  imports: [FormsModule],
  templateUrl: './verificar.html',
  styleUrl: './verificar.scss'
})
export class VerificarComponent implements OnInit {
  hash = signal('');
  estado = signal<Estado>('idle');
  resultado = signal<VerificarResponse | null>(null);
  error = signal<string | null>(null);
  modoPublico = signal(false);

  constructor(
    private certService: CertificacionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hashParam = this.route.snapshot.paramMap.get('hash');
    const codigoParam = this.route.snapshot.paramMap.get('codigo');
    if (hashParam) {
      this.hash.set(hashParam);
      this.modoPublico.set(true);
      this.verificar();
    } else if (codigoParam) {
      this.modoPublico.set(true);
      this.consultarPorCodigo(codigoParam);
    }
  }

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

  consultarPorCodigo(codigo: string): void {
    this.estado.set('buscando');
    this.error.set(null);

    this.certService.consultarIdentificador(codigo).subscribe({
      next: (res) => {
        console.log('fecha_certificacion:', res.fecha_certificacion);
        console.log('tipo:', typeof res.fecha_certificacion);
        if (!res.existe) {
          this.estado.set('no_encontrado');
          return;
        }
        if (!res.certificado) {
          this.estado.set('no_encontrado');
          return;
        }
        this.hash.set(res.hash_documento);
        this.resultado.set({
          existe: true,
          hash: res.hash_documento,
          descripcion: res.descripcion,
          certificadoPor: res.wallet_address,
          timestamp: res.fecha_certificacion,
          tx_hash: res.tx_hash,
        });
        this.estado.set('encontrado');
      },
      error: () => {
        this.estado.set('no_encontrado');
      }
    });
  }

  formatearFecha(timestamp: string | undefined): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  reset(): void {
    this.hash.set('');
    this.estado.set('idle');
    this.resultado.set(null);
    this.error.set(null);
    this.modoPublico.set(false);
  }
}
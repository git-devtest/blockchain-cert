import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CertificacionService } from '../../services/certificacion';

type Estado = 'idle' | 'generando' | 'generado' | 'error';

@Component({
  selector: 'app-identificador',
  imports: [FormsModule],
  templateUrl: './identificador.html',
  styleUrl: './identificador.scss'
})
export class IdentificadorComponent implements OnInit {
  tipos = signal<any[]>([]);
  tipoSeleccionado = signal<number | null>(null);
  estado = signal<Estado>('idle');
  resultado = signal<any>(null);
  error = signal<string | null>(null);

  constructor(private certService: CertificacionService) {}

  ngOnInit(): void {
    this.certService.listarTipos().subscribe({
      next: (tipos) => this.tipos.set(tipos),
      error: () => this.error.set('Error al cargar los tipos de documento')
    });
  }

  generar(): void {
    if (!this.tipoSeleccionado()) return;

    this.estado.set('generando');
    this.error.set(null);

    this.certService.generarIdentificador(this.tipoSeleccionado()!).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.estado.set('generado');
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al generar identificador');
        this.estado.set('error');
      }
    });
  }

  copiarCodigo(): void {
    if (this.resultado()) {
      navigator.clipboard.writeText(this.resultado().identificador.codigo);
    }
  }

  copiarParrafo(): void {
    if (this.resultado()) {
      navigator.clipboard.writeText(this.resultado().parrafo);
    }
  }

  reset(): void {
    this.tipoSeleccionado.set(null);
    this.estado.set('idle');
    this.resultado.set(null);
    this.error.set(null);
  }
}

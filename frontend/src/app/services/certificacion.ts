import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Certificacion {
  id?: number;
  hash_documento: string;
  descripcion: string;
  wallet_address: string;
  tx_hash?: string;
  created_at?: string;
}

export interface CertificarRequest {
  contenido?: string;
  descripcion: string;
  hashPrecalculado?: string;
  identificador?: string;
}

export interface CertificarResponse {
  mensaje: string;
  hash: string;
  tx_hash: string;
  data: Certificacion;
}

export interface VerificarResponse {
  existe: boolean;
  hash?: string;
  descripcion?: string;
  certificadoPor?: string;
  timestamp?: string;
  tx_hash?: string;
  created_at?: string;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CertificacionService {
  private apiUrl = '/api';
  private opts = { withCredentials: true };

  constructor(private http: HttpClient) {}

  certificar(data: CertificarRequest): Observable<CertificarResponse> {
    return this.http.post<CertificarResponse>(`${this.apiUrl}/certificar`, data, this.opts);
  }

  verificar(hash: string): Observable<VerificarResponse> {
    return this.http.get<VerificarResponse>(`${this.apiUrl}/verificar/${hash}`);
  }

  listar(): Observable<Certificacion[]> {
    return this.http.get<Certificacion[]>(`${this.apiUrl}/certificaciones`, this.opts);
  }

  listarTipos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/identificadores/tipos`, this.opts);
  }

  generarIdentificador(tipo_documento_id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/identificadores/generar`, { tipo_documento_id }, this.opts);
  }

  consultarIdentificador(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/identificadores/consultar/${codigo}`);
  }

}

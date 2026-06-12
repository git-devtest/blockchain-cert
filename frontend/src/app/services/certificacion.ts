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

  constructor(private http: HttpClient) {}

  certificar(data: CertificarRequest): Observable<CertificarResponse> {
    return this.http.post<CertificarResponse>(`${this.apiUrl}/certificar`, data);
  }

  verificar(hash: string): Observable<VerificarResponse> {
    return this.http.get<VerificarResponse>(`${this.apiUrl}/verificar/${hash}`);
  }

  listar(): Observable<Certificacion[]> {
    return this.http.get<Certificacion[]>(`${this.apiUrl}/certificaciones`);
  }
}
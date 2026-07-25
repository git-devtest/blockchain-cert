import { pool } from "../config/database";

export interface TipoDocumento {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface Identificador {
  id?: number;
  codigo: string;
  tipo_documento_id: number;
  año: number;
  contador: number;
  certificacion_id?: number | null;
  created_at?: string;
  tipo_documento?: TipoDocumento;
  // Campos del JOIN con tipos_documento y certificaciones
  tipo_codigo?: string;
  tipo_nombre?: string;
  hash_documento?: string;
  descripcion?: string;
  wallet_address?: string;
  tx_hash?: string;
  cert_created_at?: string;
}

export const IdentificadorModel = {

  async listarTipos(): Promise<TipoDocumento[]> {
    const result = await pool.query(
      `SELECT * FROM tipos_documento WHERE activo = true ORDER BY nombre`
    );
    return result.rows;
  },

  async generar(tipo_documento_id: number): Promise<Identificador> {
    const año = new Date().getFullYear();

    // Obtener el tipo de documento
    const tipoResult = await pool.query(
      `SELECT * FROM tipos_documento WHERE id = $1`,
      [tipo_documento_id]
    );
    const tipo = tipoResult.rows[0];
    if (!tipo) throw new Error('Tipo de documento no encontrado');

    // Obtener el siguiente contador para ese tipo y año
    const contadorResult = await pool.query(
      `SELECT COALESCE(MAX(contador), 0) + 1 AS siguiente
       FROM identificadores
       WHERE tipo_documento_id = $1 AND año = $2`,
      [tipo_documento_id, año]
    );
    const contador = contadorResult.rows[0].siguiente;

    // Generar el código
    const codigo = `CBC-${tipo.codigo}-${String(contador).padStart(5, '0')}-${año}`;

    // Insertar
    const result = await pool.query(
      `INSERT INTO identificadores (codigo, tipo_documento_id, año, contador)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [codigo, tipo_documento_id, año, contador]
    );

    return { ...result.rows[0], tipo_documento: tipo };
  },

  async buscarPorCodigo(codigo: string): Promise<Identificador | null> {
    const result = await pool.query(
      `SELECT i.*, t.codigo as tipo_codigo, t.nombre as tipo_nombre,
              c.hash_documento, c.descripcion, c.wallet_address, c.tx_hash, c.created_at as cert_created_at
       FROM identificadores i
       JOIN tipos_documento t ON i.tipo_documento_id = t.id
       LEFT JOIN certificaciones c ON i.certificacion_id = c.id
       WHERE i.codigo = $1`,
      [codigo]
    );
    if (!result.rows[0]) return null;
  
    const row = result.rows[0];
    if (row.cert_created_at) {
      const d = new Date(row.cert_created_at);
      row.cert_created_at = new Date(d.getTime() + 5 * 60 * 60 * 1000).toISOString();
    }

    return row;
  },

  async vincularCertificacion(codigo: string, certificacion_id: number): Promise<void> {
    await pool.query(
      `UPDATE identificadores SET certificacion_id = $1 WHERE codigo = $2`,
      [certificacion_id, codigo]
    );
  }
};

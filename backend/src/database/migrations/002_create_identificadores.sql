CREATE TABLE IF NOT EXISTS tipos_documento (
    id          SERIAL PRIMARY KEY,
    codigo      VARCHAR(20) NOT NULL UNIQUE,
    nombre      VARCHAR(100) NOT NULL,
    activo      BOOLEAN DEFAULT true,
    created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO tipos_documento (codigo, nombre) VALUES
    ('CARTA', 'Carta'),
    ('ACTA', 'Acta'),
    ('INFORME', 'Informe'),
    ('CONTRATO', 'Contrato'),
    ('RESOLUCION', 'Resolución'),
    ('CERTIFICADO', 'Certificado'),
    ('OFICIO', 'Oficio'),
    ('CIRCULAR', 'Circular')
ON CONFLICT (codigo) DO NOTHING;

CREATE TABLE IF NOT EXISTS identificadores (
    id                  SERIAL PRIMARY KEY,
    codigo              VARCHAR(50) NOT NULL UNIQUE,
    tipo_documento_id   INTEGER NOT NULL REFERENCES tipos_documento(id),
    año                 INTEGER NOT NULL,
    contador            INTEGER NOT NULL,
    certificacion_id    INTEGER REFERENCES certificaciones(id),
    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_identificadores_codigo
    ON identificadores(codigo);

CREATE INDEX IF NOT EXISTS idx_identificadores_tipo_año
    ON identificadores(tipo_documento_id, año);

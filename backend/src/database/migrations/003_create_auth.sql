CREATE TABLE IF NOT EXISTS usuarios (
    id                  SERIAL PRIMARY KEY,
    nombre              VARCHAR(100) NOT NULL,
    email               VARCHAR(150) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    rol                 VARCHAR(20) NOT NULL DEFAULT 'certificador'
                        CHECK (rol IN ('admin', 'certificador')),
    activo              BOOLEAN DEFAULT true,
    reset_token         VARCHAR(255),
    reset_token_expira  TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auditoria (
    id              SERIAL PRIMARY KEY,
    usuario_id      INTEGER REFERENCES usuarios(id),
    rol             VARCHAR(20),
    actividad       VARCHAR(50) NOT NULL,
    detalle         JSONB,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario
    ON auditoria(usuario_id);

CREATE INDEX IF NOT EXISTS idx_auditoria_actividad
    ON auditoria(actividad);

CREATE INDEX IF NOT EXISTS idx_auditoria_created_at
    ON auditoria(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- Usuario admin por defecto (contraseña: Admin2026*)
INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES (
    'Administrador',
    'admin@blockchaincert.local',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8Bi0GH3SXUQ8Wm6BKWC',
    'admin'
) ON CONFLICT (email) DO NOTHING;

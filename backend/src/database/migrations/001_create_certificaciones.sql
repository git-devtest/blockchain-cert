CREATE TABLE IF NOT EXISTS certificaciones (
    id              SERIAL PRIMARY KEY,
    hash_documento  VARCHAR(66) NOT NULL UNIQUE,
    descripcion     TEXT NOT NULL,
    wallet_address  VARCHAR(42) NOT NULL,
    tx_hash         VARCHAR(66),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificaciones_hash 
    ON certificaciones(hash_documento);

CREATE INDEX IF NOT EXISTS idx_certificaciones_wallet 
    ON certificaciones(wallet_address);
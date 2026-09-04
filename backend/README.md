# Backend — Blockchain Cert

API REST en Node.js, Express y TypeScript. Certifica hashes en Polygon Amoy, guarda historial e identificadores en PostgreSQL y gestiona autenticación (JWT en cookie), roles y auditoría.

La guía de arranque del monorepo está en el [README raíz](../README.md).

## Stack

- Express 5, TypeScript, ethers.js v6
- PostgreSQL 15 (Docker Compose, puerto host `5434`)
- JWT (`JWT_SECRET`, `JWT_EXPIRES`) y bcrypt
- Swagger UI en `/api-docs`

## Variables de entorno

Copia `.env.example` a `.env`. Compose inyecta `DATABASE_URL` interno (`db:5432`) y las claves de Amoy/JWT. `DATABASE_URL` del `.env` con puerto `5434` sirve si ejecutas el API en el host contra Postgres en Docker.

## Docker

```bash
cp .env.example .env
docker compose build
docker compose up
```

Las migraciones `001`–`003` se aplican solo al crear el volumen. Si el volumen ya existe, aplícalas a mano o elimínalo antes de volver a levantar.

## Desarrollo sin Docker (API)

No uses `npm run dev` si el servicio `backend` de Compose ya está arriba (mismo puerto `3000`). Esta vía es solo si corres Node en el host contra Postgres en Docker (`DATABASE_URL` con puerto `5434`):

```bash
npm install
npm run dev
```

## Endpoints

| Prefijo | Descripción |
|---|---|
| `POST /api/auth/*` | Login, logout, perfil, recuperación de contraseña |
| `GET /api/admin/*` | Auditoría, usuarios y certificaciones (rol `admin`) |
| `POST /api/certificar` | Certificación on-chain (autenticado) |
| `GET /api/verificar/:hash` | Verificación pública |
| `GET /api/certificaciones` | Historial (autenticado) |
| `/api/identificadores/*` | Tipos y generación (autenticado); consulta por código (pública) |
| `GET /health` | API, base de datos y red Amoy |

Detalle y ejemplos: `http://localhost:3000/api-docs`.

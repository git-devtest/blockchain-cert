# Blockchain Cert

Certificador de documentos on-chain sobre Polygon Amoy Testnet. El proyecto es un MVP funcional: calcula el hash SHA-256 de un documento (texto o archivo), lo registra en un smart contract Solidity, persiste el historial en PostgreSQL y restringe la emisión de certificados a usuarios autenticados.

## Estado actual del proyecto

El repositorio incluye una implementación end-to-end con las siguientes capacidades:

- Autenticación con JWT en cookie httpOnly, roles `admin` y `certificador`, perfil y recuperación de contraseña.
- Panel de administración: listado de usuarios y registro de auditoría.
- Certificación de texto y archivos desde el frontend (requiere sesión).
- Cálculo del hash SHA-256 en el navegador antes de enviarlo al backend.
- Registro on-chain a través de un contrato desplegado en Polygon Amoy.
- Verificación pública por hash desde la interfaz y por URL directa (`/verificar/:hash`).
- Consulta pública de documentos por identificador único desde `/consultar/:codigo`.
- Generación de identificadores únicos por tipo de documento (`CBC-TIPO-00001-2026`).
- Párrafo predefinido de autenticidad generado automáticamente para incluir en el documento.
- Vinculación entre identificador y certificación en blockchain.
- Historial de certificaciones persistido en PostgreSQL con acciones rápidas.
- Generación de stickers PDF con QR para compartir la verificación.
- Documentación de la API con Swagger.

Este estado lo posiciona como un MVP funcional. La verificación y la consulta por identificador siguen siendo públicas; certificar, historial, identificadores y administración requieren cuenta.

## ¿Por qué blockchain?

El valor del proyecto no es solo técnico, sino también filosófico: una vez que el hash de un documento queda registrado en una blockchain pública, nadie puede alterarlo ni antedatarlo, ni siquiera el administrador del sistema. Cualquier persona puede verificar la autenticidad de un documento sin depender de una autoridad central.

## Arquitectura

```text
Frontend (Angular) → Backend (Node.js/Express) → Smart Contract (Solidity/Polygon Amoy)
                            ↓
                     PostgreSQL (historial, identificadores, usuarios, auditoría)
```

| Capa | Tecnología |
|---|---|
| Frontend | Angular 21, SCSS |
| Backend | Node.js, Express, TypeScript |
| Autenticación | JWT (cookie httpOnly), bcrypt, roles `admin` / `certificador` |
| Base de datos | PostgreSQL 15 |
| Blockchain | Solidity 0.8.28, Hardhat, ethers.js v6 |
| Red | Polygon Amoy Testnet (Chain ID: 80002) |
| Contenedores | Docker, Docker Compose |

## Funcionalidades implementadas

- Inicio de sesión, cierre de sesión, perfil y recuperación de contraseña (en desarrollo el API devuelve el enlace; en producción debería enviarse por correo).
- Roles: `certificador` emite certificados; `admin` además ve usuarios y auditoría.
- Certificación de documentos desde una interfaz web moderna (rutas protegidas).
- Soporte para texto y archivos (PDF, DOCX, imágenes, etc.).
- Previsualización del hash SHA-256 calculado antes de certificar.
- Verificación pública de un documento por hash desde la app o por URL directa.
- Generación de identificadores únicos por tipo de documento (`CBC-TIPO-00001-2026`).
- Párrafo predefinido de autenticidad con instrucciones para incluir en el documento antes de certificar.
- Consulta pública de documentos certificados por identificador.
- Historial con acciones rápidas: verificar, ver en Polygonscan y descargar sticker.
- Descarga de un sticker PDF con QR y datos resumidos del certificado.
- API REST documentada con Swagger.

## Smart Contract

| Campo | Valor |
|---|---|
| Contrato | `CertificadorDocumentos.sol` |
| Red | Polygon Amoy Testnet |
| Address | `0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0` |
| Verificado | [Sourcify](https://sourcify.dev/server/repo-ui/80002/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0) |
| Explorador | [Polygonscan Amoy](https://amoy.polygonscan.com/address/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0) |

### Funciones del contrato

- `certificar(hashDoc, descripcion)`: registra el hash on-chain y rechaza documentos ya certificados.
- `verificar(hashDoc)`: consulta si un hash existe y devuelve metadatos como quién lo registró y cuándo.

## Estructura del proyecto

```text
├── backend                         # API REST Node.js/Express
│   └── src
│       ├── config                  # PostgreSQL, ethers.js, JWT, Swagger
│       ├── controllers
│       ├── database
│       │   └── migrations          # certificaciones, identificadores, auth
│       ├── middleware              # autenticación y autorización
│       ├── models
│       └── routes                  # auth, admin, certificaciones, identificadores
│   ├── Dockerfile
│   └── docker-compose.yml          # backend + PostgreSQL
├── contracts                       # Smart contracts Solidity + Hardhat
│   ├── contracts                   # CertificadorDocumentos.sol
│   ├── ignition                    # Módulos de despliegue
│   │   ├── deployments
│   │   └── modules
│   ├── scripts
│   └── test                        # Tests unitarios con Mocha
└── frontend                        # Angular 21
    ├── public
    └── src
        └── app
            ├── components
            │   ├── admin           # auditoría, usuarios
            │   ├── certificar
            │   ├── historial
            │   ├── identificador
            │   ├── login
            │   ├── perfil
            │   └── verificar
            ├── guards
            └── services
```

## Requisitos

- Node.js v22 LTS
- npm
- Docker y Docker Compose
- Una wallet con fondos en Polygon Amoy para emitir transacciones reales
- nvm (recomendado)

## Correr localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/git-devtest/blockchain-cert.git
cd blockchain-cert
```

### 2. Instalar dependencias

Solo hace falta Node/npm para el frontend (o para correr el API fuera de Docker). El backend en Compose no usa `npm run dev`.

```bash
cd frontend && npm install && cd ..
```

Si quieres el atajo de la raíz (`npm run dev` = Compose + Angular), instala también ahí:

```bash
npm install
```

### 3. Configurar variables de entorno del backend

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env`:

```env
PORT=3000
DB_USER=admin
DB_PASSWORD=tu_password
DATABASE_URL=postgresql://admin:tu_password@localhost:5434/blockchain_cert
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
AMOY_PRIVATE_KEY=tu_private_key_de_metamask
CONTRACT_ADDRESS=0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0
JWT_SECRET=cambia_este_secreto
JWT_EXPIRES=8h
```

`DATABASE_URL` con el puerto `5434` aplica si el backend corre en el host y PostgreSQL en Docker. Dentro de Compose, el backend usa el host interno `db` y el puerto `5432`.

### 4. Levantar backend y PostgreSQL

Compose arranca la API y la base de datos. No hace falta `npm run dev` para el backend: si `/health` responde `ok`, el API ya está en marcha.

```bash
cd backend
docker compose up --build
```

- API docs:     `http://localhost:3000/api-docs`
- Health check: `http://localhost:3000/health`

`/health` comprueba API, PostgreSQL y Polygon Amoy:

```json
{
  "status": "ok",
  "timestamp": "2026-06-26T04:24:12.878Z",
  "servicios": {
    "api": "ok",
    "database": "ok",
    "blockchain": "ok"
  }
}
```

### 5. Frontend (opcional)

La interfaz Angular no va en Compose. Con el API ya levantado:

```bash
cd frontend
npm start
```

- Frontend: `http://localhost:4200`

El frontend usa un proxy (`frontend/proxy.conf.json`) para reenviar `/api` al backend.

Atajo desde la raíz (Compose + Angular a la vez; no lo uses si Compose ya está en ejecución):

```bash
npm run dev
```

### Usuario inicial

La migración `003_create_auth.sql` crea un administrador de desarrollo:

| Campo | Valor |
|---|---|
| Email | `admin@blockchaincert.local` |
| Contraseña | `Admin2026*` |
| Rol | `admin` |

Cambia esta contraseña antes de cualquier entorno compartido.

Las migraciones `001`, `002` y `003` se ejecutan al inicializar el volumen de PostgreSQL. Si el volumen `blockchain_cert_data` ya existía, aplica las migraciones pendientes a mano o recrea el volumen.

### Aplicar cambios en el backend

El backend corre dentro de un contenedor Docker. El código se copia a la imagen en el momento del build, por lo tanto **los cambios en `backend/src` no se reflejan automáticamente**.

Si modificas el backend, reconstruye la imagen antes de levantar de nuevo:

```bash
cd backend
docker compose up --build
```

Los cambios en el frontend (Angular) sí se reflejan en caliente sin pasos adicionales.

## Autenticación y rutas

La sesión se guarda en una cookie `token` (JWT, httpOnly). Las peticiones autenticadas del frontend envían cookies (`withCredentials`).

| Ruta | Acceso |
|---|---|
| `/login`, `/cambiar-password/:token` | Público |
| `/verificar`, `/verificar/:hash`, `/consultar/:codigo` | Público |
| `/certificar`, `/historial`, `/identificador`, `/perfil` | Usuario autenticado |
| `/admin/auditoria`, `/admin/usuarios` | Rol `admin` |

## Endpoints principales

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/perfil`
- `POST /api/auth/recuperar-password`
- `POST /api/auth/cambiar-password/:token`

### Administración (rol `admin`)

- `GET /api/admin/auditoria`
- `GET /api/admin/certificaciones`
- `GET /api/admin/usuarios`

### Certificaciones

- `POST /api/certificar` (autenticado)
- `GET /api/verificar/:hash` (público)
- `GET /api/certificaciones` (autenticado)

### Identificadores

- `GET /api/identificadores/tipos` (autenticado)
- `POST /api/identificadores/generar` (autenticado)
- `GET /api/identificadores/consultar/:codigo` (público)

## Flujos de uso

### Acceso

1. Abrir `http://localhost:4200` (redirige a certificar; sin sesión, al login).
2. Iniciar sesión con una cuenta de la tabla `usuarios`.
3. El menú muestra Certificar, Verificar, Historial e Identificador. Si el rol es `admin`, también Auditoría y Usuarios.

### Flujo directo (sin identificador)

1. El usuario autenticado escribe texto o sube un archivo.
2. El frontend calcula el SHA-256 en el navegador.
3. El hash se envía al backend.
4. El backend llama al smart contract `certificar()` en Polygon Amoy.
5. La transacción queda confirmada on-chain.
6. El hash y la metadata se guardan en PostgreSQL para consultas rápidas.
7. El usuario recibe el hash de la transacción y puede descargar un sticker PDF.

### Flujo con identificador

1. El usuario genera un identificador desde **Identificador** seleccionando el tipo de documento.
2. Copia el código (`CBC-TIPO-00001-2026`) y lo agrega en la esquina superior derecha del documento.
3. Copia el párrafo predefinido de autenticidad y lo agrega al pie de página del documento.
4. Guarda el documento como PDF.
5. Va a **Certificar**, sube el PDF, llena la descripción e ingresa el identificador en el campo opcional.
6. Cualquier persona puede consultar el documento en `/consultar/:codigo` sin necesidad del hash ni de iniciar sesión.

## Verificación de documentos

### Por hash

Cualquier persona puede verificar un documento sin usar esta aplicación:

1. Calcular el SHA-256 del documento.
2. Consultar directamente el contrato en Polygonscan:  
   `https://amoy.polygonscan.com/address/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0`
3. Llamar a la función `verificar` con el hash.

También puede usar `http://localhost:4200/verificar/<hash>`.

### Por identificador

Si el documento fue certificado con un identificador, cualquier persona puede consultarlo en:

`http://localhost:4200/consultar/CBC-TIPO-00001-2026`

La página muestra la información en lenguaje simple para usuarios no técnicos, con enlace directo a Polygonscan para verificación independiente.

## Próximos pasos sugeridos

- Enviar el enlace de recuperación de contraseña por correo en producción.
- Mejorar la experiencia de wallet y manejo de errores en la red.
- Ampliar la cobertura de tests en frontend, backend y contratos.
- Añadir soporte para más redes y despliegues productivos.
- Mejorar el proceso de verificación pública con enlaces más legibles y compartibles.

## Tests

```bash
cd contracts
npx hardhat test
```

El frontend puede ejecutar pruebas unitarias con Vitest:

```bash
cd frontend
npm test
```

## Licencia

MIT

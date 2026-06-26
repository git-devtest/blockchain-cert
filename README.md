# Blockchain Cert
Certificador de documentos on-chain sobre Polygon Amoy Testnet. El proyecto actual funciona como un MVP funcional para certificar documentos (texto o archivos), calcular su hash SHA-256, registrarlo en un smart contract Solidity y conservar el historial en PostgreSQL.

## Estado actual del proyecto
El repositorio ya incluye una implementación end-to-end con las siguientes capacidades:
- Certificación de texto y archivos desde el frontend.
- Cálculo del hash SHA-256 en el navegador antes de enviarlo al backend.
- Registro on-chain a través de un contrato desplegado en Polygon Amoy.
- Verificación pública por hash desde la interfaz y por URL directa.
- Historial de certificaciones persistido en PostgreSQL.
- Generación de stickers PDF con QR para compartir la verificación.
- Documentación de la API con Swagger.

Este estado lo posiciona como un MVP funcional, aunque aún quedan mejoras de producto y seguridad para una versión más robusta.

## ¿Por qué blockchain?
El valor del proyecto no es solo técnico, sino también filosófico: una vez que el hash de un documento queda registrado en una blockchain pública, nadie puede alterarlo ni antedatarlo, ni siquiera el administrador del sistema. Cualquier persona puede verificar la autenticidad de un documento sin depender de una autoridad central.

## Arquitectura
```text
Frontend (Angular) → Backend (Node.js/Express) → Smart Contract (Solidity/Polygon Amoy)
↓
PostgreSQL (historial)
```

| Capa | Tecnología |
|---|---|
| Frontend | Angular 21, SCSS |
| Backend | Node.js, Express, TypeScript |
| Base de datos | PostgreSQL 15 |
| Blockchain | Solidity 0.8.28, Hardhat, ethers.js v6 |
| Red | Polygon Amoy Testnet (Chain ID: 80002) |
| Contenedores | Docker, Docker Compose |

## Funcionalidades implementadas
- Certificación de documentos desde una interfaz web moderna.
- Soporte para texto y archivos.
- Previsualización del hash calculado antes de certificar.
- Verificación de un documento por hash desde la app.
- Historial con acciones rápidas para verificar y descargar un sticker.
- Descarga de un sticker PDF con QR y datos resumidos del certificado.
- API REST para certificar, verificar y listar certificaciones.

## Smart Contract
| Campo | Valor |
|---|---|
| Contrato | CertificadorDocumentos.sol |
| Red | Polygon Amoy Testnet |
| Address | 0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0 |
| Verificado | [Sourcify](https://sourcify.dev/server/repo-ui/80002/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0) |
| Explorador | [Polygonscan Amoy](https://amoy.polygonscan.com/address/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0) |

### Funciones del contrato
- certificar(hashDoc, descripcion): registra el hash on-chain y rechaza documentos ya certificados.
- verificar(hashDoc): consulta si un hash existe y devuelve metadatos como quien lo registró y cuándo.

## Estructura del proyecto
```text
blockchain-cert/
├── contracts/          # Smart contracts Solidity + Hardhat
│   ├── contracts/      # CertificadorDocumentos.sol
│   ├── test/           # Tests unitarios con Mocha
│   └── ignition/       # Módulos de despliegue
├── backend/            # API REST Node.js/Express
│   ├── src/
│   │   ├── config/     # PostgreSQL, ethers.js, Swagger
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/           # Angular 21
    └── src/app/
        ├── components/ # certificar, verificar, historial
        └── services/
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

### 2. Configurar variables de entorno del backend
```bash
cd backend
cp .env.example .env
```
Editar el archivo .env con tus credenciales:

```env
PORT=3000
DB_PASSWORD=tu_password
DATABASE_URL=postgresql://admin:tu_password@localhost:5434/blockchain_cert
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
AMOY_PRIVATE_KEY=tu_private_key_de_metamask
CONTRACT_ADDRESS=0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0
```

### 3. Levantar todo el proyecto
Desde la raíz del repositorio:

```bash
npm install
npm run dev
```

Esto levanta backend + PostgreSQL en Docker y el frontend Angular simultáneamente.

- Frontend:     `http://localhost:4200`
- API docs:     `http://localhost:3000/api-docs`
- Health check: `http://localhost:3000/health`

El endpoint `/health` valida conectividad con la base de datos y con la red Polygon Amoy:

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

## Endpoints principales
- POST /api/certificar
- GET /api/verificar/:hash
- GET /api/certificaciones

## Flujo de certificación
1. El usuario escribe texto o sube un archivo.
2. El frontend calcula el SHA-256 en el navegador.
3. El hash se envía al backend.
4. El backend llama al smart contract certificar() en Polygon Amoy.
5. La transacción queda confirmada on-chain.
6. El hash y la metadata se guardan en PostgreSQL para consultas rápidas.
7. El usuario recibe el hash de la transacción y puede descargar un sticker PDF.

## Verificación de documentos
Cualquier persona puede verificar un documento sin usar esta aplicación:
1. Calcular el SHA-256 del documento.
2. Consultar directamente el contrato en Polygonscan:
   https://amoy.polygonscan.com/address/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0
3. Llamar a la función verificar con el hash.

## Próximos pasos sugeridos
- Mejorar la experiencia de wallet y manejo de errores en la red.
- Añadir autenticación de usuarios y roles.
- Ampliar la cobertura de tests en frontend, backend y contratos.
- Añadir soporte para más redes y despliegues productivos.
- Mejorar el proceso de verificación pública con enlaces más legibles y compartibles.

## Tests
```bash
cd contracts
npx hardhat test
```

## Licencia
MIT
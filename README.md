# Blockchain Cert
Certificador de documentos on-chain sobre Polygon Amoy testnet. Permite certificar documentos (texto o archivos) calculando su hash SHA-256 y registrándolo permanentemente en la blockchain mediante un smart contract en Solidity.

## ¿Por qué blockchain?
El valor de este proyecto no es técnico sino filosófico: una vez que el hash de un documento queda registrado en una blockchain pública, **nadie puede alterarlo ni antedatarlo**, ni siquiera el administrador del sistema. Cualquier persona en el mundo puede verificar la autenticidad de un documento sin depender de una autoridad central.

## Arquitectura
```
Frontend (Angular) → Backend (Node.js/Express) → Smart Contract (Solidity/Polygon Amoy)
↓
PostgreSQL (historial)
```
| Capa | Tecnología |
|---|---|
| Frontend | Angular 19, SCSS |
| Backend | Node.js, Express, TypeScript |
| Base de datos | PostgreSQL 15 |
| Blockchain | Solidity 0.8.28, Hardhat, ethers.js v6 |
| Red | Polygon Amoy Testnet (Chain ID: 80002) |
| Contenedores | Docker, Docker Compose |

## Smart Contract
| Campo | Valor |
|---|---|
| Contrato | `CertificadorDocumentos.sol` |
| Red | Polygon Amoy Testnet |
| Address | `0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0` |
| Verificado | [Sourcify](https://sourcify.dev/server/repo-ui/80002/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0) |
| Explorador | [Polygonscan Amoy](https://amoy.polygonscan.com/address/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0) |

### Funciones del contrato
- `certificar(hashDoc, descripcion)` — registra el hash on-chain, solo acepta documentos nuevos
- `verificar(hashDoc)` — consulta si un hash existe, retorna metadata (quién, cuándo)

## Estructura del proyecto
```
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
└── frontend/           # Angular 19
     └── src/app/
             ├── components/ # certificar, verificar, historial
             └── services/
```
## Correr localmente
### Requisitos
- Node.js v22 LTS
- Docker y Docker Compose
- nvm (recomendado)

### 1. Clonar el repositorio
```bash
git clone https://github.com/git-devtest/blockchain-cert.git
cd blockchain-cert
```

### 2. Configurar variables de entorno del backend
```bash
cd backend
cp .env.example .env

# Editar .env con tus credenciales
Variables requeridas:
PORT=3000
DB_PASSWORD=tu_password
DATABASE_URL=postgresql://admin:tu_password@localhost:5434/blockchain_cert
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
AMOY_PRIVATE_KEY=tu_private_key_de_metamask
CONTRACT_ADDRESS=0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0
```

### 3. Levantar backend y base de datos
```bash
cd backend
docker compose up -d
```

### 4. Levantar frontend
```bash
cd frontend
npm install
ng serve
```
Abrir `http://localhost:4200`

### 5. Documentación de la API
Con el backend corriendo, abrir `http://localhost:3000/api-docs`

## Flujo de certificación
1. El usuario sube un archivo o escribe texto
2. El frontend calcula el SHA-256 en el browser (el contenido nunca sale del dispositivo)
3. El hash se envía al backend
4. El backend llama al smart contract `certificar()` en Polygon Amoy
5. La transacción queda confirmada on-chain
6. El hash y metadata se guardan en PostgreSQL para consultas rápidas
7. El usuario recibe el TX hash con link directo a Polygonscan

## Verificación de documentos
Cualquier persona puede verificar un documento sin usar esta aplicación:
1. Calcular el SHA-256 del documento
2. Consultar directamente el contrato en Polygonscan:
   `https://amoy.polygonscan.com/address/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0`
3. Llamar la función `verificar` con el hash

## Tests
```bash
cd contracts
npx hardhat test
```

## Licencia
MIT
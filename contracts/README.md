# Contratos — Blockchain Cert

Smart contract `CertificadorDocumentos` (Solidity 0.8.28) desplegado en Polygon Amoy. La guía general del proyecto está en el [README raíz](../README.md).

## Contrato desplegado

| Campo | Valor |
|---|---|
| Red | Polygon Amoy Testnet |
| Chain ID | 80002 |
| Address | `0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0` |
| Verificado en | [Sourcify](https://sourcify.dev/server/repo-ui/80002/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0) |
| Explorador | [Polygonscan Amoy](https://amoy.polygonscan.com/address/0xA73F1BB8668e30558CC77F9d937104a58Cc64CA0) |

### Funciones

- `certificar(string hashDoc, string descripcion)`: registra el hash; revierte si ya existe.
- `verificar(string hashDoc)`: devuelve `existe`, `descripcion`, `certificadoPor` y `timestamp`.

## Configuración

```bash
cp .env.example .env
npm install
```

En `.env` (o variables de Hardhat) se usan `AMOY_RPC_URL` y `AMOY_PRIVATE_KEY`. La red `amoy` está definida en `hardhat.config.ts`.

## Tests

```bash
npx hardhat test
```

Solo Mocha o solo Solidity:

```bash
npx hardhat test mocha
npx hardhat test solidity
```

## Despliegue (Ignition)

Módulo: `ignition/modules/CertificadorDocumentos.ts`.

Red local simulada:

```bash
npx hardhat ignition deploy ignition/modules/CertificadorDocumentos.ts
```

Polygon Amoy:

```bash
npx hardhat ignition deploy --network amoy ignition/modules/CertificadorDocumentos.ts
```

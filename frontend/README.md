# Frontend — Blockchain Cert

Aplicación web en Angular 21 para certificar documentos on-chain, verificar hashes, generar identificadores y administrar usuarios. La guía de arranque del monorepo está en el [README raíz](../README.md).

Generada con [Angular CLI](https://github.com/angular/angular-cli) 21.2.9. Estilos en SCSS. El hash SHA-256 se calcula en el navegador (`@noble/hashes`) antes de enviarlo al API.

## Requisitos

- Node.js v22 LTS
- Backend en `http://localhost:3000` (el proxy reenvía `/api`)

## Desarrollo

```bash
npm install
npm start
```

`npm start` ejecuta `ng serve` con `proxy.conf.json`. Abre `http://localhost:4200`. Los cambios se recargan en caliente.

Si el API ya está en Compose (`docker compose up` en `backend/`), basta con `npm start` aquí. El atajo de la raíz (`npm run dev`) levanta Compose y este frontend a la vez; no lo uses si Compose ya está en ejecución.

## Proxy

Las peticiones a `/api` se reenvían a `http://localhost:3000`. Las llamadas autenticadas envían cookies (`withCredentials`) porque la sesión es un JWT en cookie httpOnly.

## Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/login` | Público | Inicio de sesión y recuperación de contraseña |
| `/cambiar-password/:token` | Público | Nueva contraseña con token de recuperación |
| `/verificar`, `/verificar/:hash` | Público | Verificación por hash |
| `/consultar/:codigo` | Público | Consulta por identificador (`CBC-TIPO-00001-2026`) |
| `/certificar` | Autenticado | Texto o archivo, hash previo y certificación |
| `/historial` | Autenticado | Historial, Polygonscan y sticker PDF |
| `/identificador` | Autenticado | Generar código y párrafo de autenticidad |
| `/perfil` | Autenticado | Datos de la sesión |
| `/admin/auditoria` | Rol `admin` | Registro de actividad |
| `/admin/usuarios` | Rol `admin` | Listado de usuarios |

La raíz redirige a `/certificar`. Sin sesión, `authGuard` envía a `/login`. Las rutas de admin exigen `rol: admin`.

## Estructura

```text
src/app
├── app.routes.ts
├── guards/auth-guard.ts
├── services
│   ├── auth.ts
│   ├── certificacion.ts
│   └── sticker.ts          # PDF + QR (jspdf, qrcode)
└── components
    ├── admin/auditoria
    ├── admin/usuarios
    ├── certificar
    ├── historial
    ├── identificador
    ├── login
    ├── perfil
    └── verificar
```

## Build

```bash
npm run build
```

El resultado queda en `dist/`. `npm run watch` compila en modo development.

## Tests

Pruebas unitarias con Vitest:

```bash
npm test
```

No hay suite e2e configurada.

## Recursos

- [Angular CLI](https://angular.dev/tools/cli)
- API y Swagger: `http://localhost:3000/api-docs`

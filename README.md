# DeliveryTraking — Backend

Rastreo de paquetes enviados en vuelos dentro de EE. UU., con la posición del avión en vivo desde OpenSky Network.

## Stack

Node.js (LTS) + Express 5 + TypeScript estricto, Zod, pino (logs JSON), Axios (solo para OpenSky). Próximamente: PostgreSQL + Prisma y WebSocket (`ws`).

## Instalar y correr (PowerShell)

```powershell
cd backend
npm install
Copy-Item .env.example .env   # luego completa los valores en .env
npm run dev                   # servidor en http://localhost:3000
```

Otros scripts:

| Comando | Qué hace |
|---|---|
| `npm run typecheck` | Revisa los tipos con TypeScript (`tsc --noEmit`). |
| `npm run fixture:save` | Guarda una respuesta real de OpenSky en `fixtures/opensky-sample.json`. |

Prueba rápida:

```powershell
curl.exe -i http://localhost:3000/health
Invoke-RestMethod http://localhost:3000/api/aircraft | Select-Object count
```

## Variables de entorno (`backend/.env.example`)

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto `3000`). |
| `NODE_ENV` | `development`, `test` o `production`. |
| `CORS_ORIGIN` | Origen(es) del frontend permitidos, separados por coma. **Obligatoria.** |
| `DATABASE_URL` | Conexión a PostgreSQL (se usará con Prisma). |
| `OPENSKY_CLIENT_ID` | Client id OAuth2 de OpenSky. Vacío = modo anónimo. |
| `OPENSKY_CLIENT_SECRET` | Client secret OAuth2 de OpenSky. |
| `OPENSKY_CACHE_TTL_MS` | Vida de la caché de OpenSky en ms (mínimo `10000`). |
| `LOG_LEVEL` | Nivel de logs: `fatal`, `error`, `warn`, `info`, `debug` o `trace`. |
| `USE_FIXTURE` | `true` sirve los datos grabados en vez de llamar a OpenSky (plan B de demo). |

El servidor valida estas variables con Zod al arrancar y no inicia si alguna es inválida. `.env` nunca se sube a Git.

## Estructura (`backend/`)

```
server.ts / app.ts   arranque del servidor / configuración de Express
config/              env (validado con Zod) y logger
routes/ -> middlewares/ -> controllers/ -> services/ -> providers/ | repositories/
validators/          esquemas Zod
types/  utils/       contratos (AircraftState), AppError, caché TTL
fixtures/  scripts/  respuesta real de OpenSky y script para regenerarla
models/  migrations/  websocket/   reservadas para próximas entregas
```

Más detalle, archivo por archivo, en [`backend/EXPLICACION.md`](backend/EXPLICACION.md).

## Estado actual

**Funciona hoy**
- `GET /health`, con el header `x-correlation-id` y logs estructurados.
- `GET /api/aircraft`: aviones reales sobre EE. UU. (OpenSky con OAuth2 y caché en memoria).
- `GET /api/aircraft/:icao24`: un avión concreto, con validación Zod.
- Manejo global de errores con formato JSON único, `helmet`, CORS y rate limiting.
- Plan B de demo con datos grabados (`USE_FIXTURE=true`).

**Viene después**
- Modelo de datos con Prisma y PostgreSQL (migraciones y seed de aeropuertos).
- Autenticación con doble token y roles (Cliente y Staff).
- Envíos y eventos de rastreo, con estados automáticos de despegue y aterrizaje.
- WebSocket con un canal por vuelo.
- Cálculo de ETA en vivo.

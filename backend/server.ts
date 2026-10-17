import { app } from './app.ts';
import { env } from './config/env.ts';
import { logger } from './config/logger.ts';

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'server started');
});

// Cierre ordenado: deja terminar las peticiones en curso antes de salir
function shutdown(signal: string): void {
  logger.info({ signal }, 'shutting down');
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

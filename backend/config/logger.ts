import { pino } from 'pino';
import { env } from './env.ts';

export const logger = pino({
  level: env.LOG_LEVEL,
  // Nunca escribir secretos en los logs aunque lleguen en headers
  redact: ['req.headers.authorization', 'req.headers.cookie'],
});

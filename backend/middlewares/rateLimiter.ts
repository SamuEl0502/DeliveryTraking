import { rateLimit } from 'express-rate-limit';
import { AppError } from '../utils/AppError.ts';

// 300 peticiones por IP cada 15 min: deja margen al polling del mapa (1 cada 10 s = 90)
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  // Delegamos al errorHandler para mantener el formato único de error
  handler: (_req, _res, next) => {
    next(new AppError(429, 'TOO_MANY_REQUESTS', 'Demasiadas peticiones, intenta más tarde'));
  },
});

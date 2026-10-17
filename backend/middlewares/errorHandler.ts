import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.ts';

// Formato único de error: { error: { code, message, correlationId } }
function sendError(req: Request, res: Response, status: number, code: string, message: string): void {
  res.status(status).json({ error: { code, message, correlationId: req.correlationId } });
}

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, 'NOT_FOUND', `Ruta ${req.method} ${req.originalUrl} no existe`));
}

// Express reconoce un manejador de errores porque recibe 4 parámetros
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    req.log.warn({ code: err.code, status: err.statusCode }, err.message);
    sendError(req, res, err.statusCode, err.code, err.message);
    return;
  }

  // JSON mal formado en el body (lo lanza express.json())
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(req, res, 400, 'INVALID_JSON', 'El cuerpo de la petición no es JSON válido');
    return;
  }

  // Error inesperado: se loguea completo, pero al cliente no se le dan detalles internos
  req.log.error({ err }, 'unhandled error');
  sendError(req, res, 500, 'INTERNAL_ERROR', 'Error interno del servidor');
}

import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { AppError } from '../utils/AppError.ts';

export function validateParams(schema: z.ZodType<Record<string, string>>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join('; ');
      next(new AppError(400, 'VALIDATION_ERROR', message));
      return;
    }
    // Reemplazamos con la versión validada y transformada (ej. icao24 en minúsculas)
    req.params = result.data;
    next();
  };
}

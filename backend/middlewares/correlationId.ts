import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.ts';

const HEADER = 'x-correlation-id';
// Solo aceptamos ids "limpios" del cliente para evitar inyectar basura en los logs
const VALID_ID = /^[\w-]{1,64}$/;

export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.get(HEADER);
  const id = incoming && VALID_ID.test(incoming) ? incoming : randomUUID();

  req.correlationId = id;
  // Logger hijo: todo lo que se loguee con req.log lleva el correlationId
  req.log = logger.child({ correlationId: id });
  res.setHeader(HEADER, id);

  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    req.log.info(
      { method: req.method, url: req.originalUrl, status: res.statusCode, ms: Math.round(ms) },
      'request completed',
    );
  });

  next();
}

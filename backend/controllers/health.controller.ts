import type { Request, Response } from 'express';

export function getHealth(_req: Request, res: Response): void {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

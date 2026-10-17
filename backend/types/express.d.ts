import type { Logger } from 'pino';

// Amplía el tipo Request de Express con lo que agrega el middleware correlationId
declare global {
  namespace Express {
    interface Request {
      correlationId: string;
      log: Logger;
    }
  }
}

export {};

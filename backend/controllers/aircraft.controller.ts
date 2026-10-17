import type { Request, Response } from 'express';
import * as aircraftService from '../services/aircraft.service.ts';

// Express 5 envía al errorHandler cualquier error de una función async, sin try/catch
export async function listAircraft(req: Request, res: Response): Promise<void> {
  const snapshot = await aircraftService.getUsAircraft(req.log);
  res.json({ time: snapshot.time, count: snapshot.aircraft.length, aircraft: snapshot.aircraft });
}

export async function getAircraft(req: Request<{ icao24: string }>, res: Response): Promise<void> {
  const aircraft = await aircraftService.getAircraftByIcao24(req.params.icao24, req.log);
  res.json(aircraft);
}

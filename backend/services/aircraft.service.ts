import type { Logger } from 'pino';
import { env } from '../config/env.ts';
import * as openSky from '../providers/openSky.provider.ts';
import type { AircraftSnapshot, AircraftState } from '../types/aircraft.ts';
import { AppError } from '../utils/AppError.ts';
import { TtlCache } from '../utils/ttlCache.ts';

// EE. UU. continental. Caja > 400 grados² = 4 créditos de OpenSky por llamada
export const US_BOX: openSky.BoundingBox = { lamin: 24.5, lomin: -125, lamax: 49.5, lomax: -66.9 };

const boxCache = new TtlCache<AircraftSnapshot>(env.OPENSKY_CACHE_TTL_MS);
const singleCache = new TtlCache<AircraftState | null>(env.OPENSKY_CACHE_TTL_MS);

export function getUsAircraft(log: Logger): Promise<AircraftSnapshot> {
  return boxCache.getOrLoad('us', () => openSky.fetchByBox(US_BOX), log);
}

export async function getAircraftByIcao24(icao24: string, log: Logger): Promise<AircraftState> {
  const aircraft = await singleCache.getOrLoad(icao24, () => openSky.fetchByIcao24(icao24), log);
  if (!aircraft) {
    throw new AppError(404, 'AIRCRAFT_NOT_FOUND', `No hay posición para el avión ${icao24}`);
  }
  return aircraft;
}

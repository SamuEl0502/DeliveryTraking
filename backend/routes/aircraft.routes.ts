import { Router } from 'express';
import { getAircraft, listAircraft } from '../controllers/aircraft.controller.ts';
import { validateParams } from '../middlewares/validate.ts';
import { icao24ParamsSchema } from '../validators/aircraft.validator.ts';

export const aircraftRouter = Router();

aircraftRouter.get('/', listAircraft);
aircraftRouter.get('/:icao24', validateParams(icao24ParamsSchema), getAircraft);

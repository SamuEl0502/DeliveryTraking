import { z } from 'zod';

// icao24: dirección del transpondedor, 6 caracteres hexadecimales (OpenSky la usa en minúsculas)
export const icao24ParamsSchema = z.object({
  icao24: z
    .string()
    .regex(/^[0-9a-fA-F]{6}$/, 'icao24 debe tener 6 caracteres hexadecimales')
    .transform((v) => v.toLowerCase()),
});

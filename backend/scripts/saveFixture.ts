import { mkdir, writeFile } from 'node:fs/promises';
import { logger } from '../config/logger.ts';
import { FIXTURE_URL, fetchRawByBox } from '../providers/openSky.provider.ts';
import { US_BOX } from '../services/aircraft.service.ts';

// Guarda la respuesta cruda (sin mapear) para que el fixture pase por el mismo código que la API real
const raw = await fetchRawByBox(US_BOX);
await mkdir(new URL('.', FIXTURE_URL), { recursive: true });
await writeFile(FIXTURE_URL, JSON.stringify(raw));
logger.info({ file: FIXTURE_URL.pathname }, 'fixture saved');

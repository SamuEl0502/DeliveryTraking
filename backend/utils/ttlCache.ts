import type { Logger } from 'pino';

interface Entry<T> {
  value: T;
  expiresAt: number;
}

export class TtlCache<T> {
  private readonly entries = new Map<string, Entry<T>>();
  // Cargas en curso: si llegan 2 peticiones a la vez, solo se hace 1 llamada externa
  private readonly pending = new Map<string, Promise<T>>();

  constructor(private readonly ttlMs: number) {}

  async getOrLoad(key: string, loader: () => Promise<T>, log: Logger): Promise<T> {
    const entry = this.entries.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      log.info({ key }, 'cache hit');
      return entry.value;
    }

    const inFlight = this.pending.get(key);
    if (inFlight) {
      log.info({ key }, 'cache wait (load in progress)');
      return inFlight;
    }

    log.info({ key }, 'cache miss');
    const promise = loader()
      .then((value) => {
        this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });
        return value;
      })
      .catch((err: unknown) => {
        // Si la fuente falla pero hay un dato viejo, mejor servirlo que responder error
        if (entry) {
          log.warn({ key, err }, 'load failed, serving stale cache');
          return entry.value;
        }
        throw err;
      })
      .finally(() => this.pending.delete(key));

    this.pending.set(key, promise);
    return promise;
  }
}

import { type Cache, caching } from 'cache-manager';

export class CacheService {
  private static instance: CacheService;

  private constructor(private readonly cache: Cache) {}

  public static async getInstance(): Promise<CacheService> {
    if (!CacheService.instance) {
      CacheService.instance = await CacheService.createInstance();
    }

    return CacheService.instance;
  }

  public static async createInstance(
    cache?: Promise<Cache> | Cache,
  ): Promise<CacheService> {
    if (!cache) {
      cache = caching('memory', {
        ttl: 30 * 1000,
      });
    }

    const instance = new CacheService(await Promise.resolve(cache));

    return instance;
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const item = await this.cache.get<T>(key);

    return item;
  }

  public async set(key: string, value: unknown, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  public async reset(): Promise<void> {
    await this.cache.reset();
  }

  public async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  public async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    return await this.cache.wrap(key, fn, ttl);
  }

  public async getCache(): Promise<Cache> {
    return this.cache;
  }
}

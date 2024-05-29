import { type Cache, type Store, caching } from 'cache-manager';

export default class CacheService {
  private static instance: CacheService;

  private constructor(public readonly cache: Cache) {}

  public static async getInstance(): Promise<CacheService> {
    if (!CacheService.instance) {
      CacheService.instance = await CacheService.createInstance();
    }

    return CacheService.instance;
  }

  public static async createInstance(
    store?: Promise<Store> | Store,
  ): Promise<CacheService> {
    const cache = store
      ? await caching(await Promise.resolve(store))
      : await caching('memory', {
          ttl: 30 * 1000,
        });

    const instance = new CacheService(cache);

    return instance;
  }

  public get = this.cache.get.bind(this.cache);

  public set = this.cache.set.bind(this.cache);

  public reset = this.cache.reset.bind(this.cache);

  public del = this.cache.del.bind(this.cache);

  public wrap = this.cache.wrap.bind(this.cache);
}

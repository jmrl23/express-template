import { CacheService } from './cache.service';
import { type Cache, caching } from 'cache-manager';

export class AppService {
  private static instance: AppService;

  private constructor(private readonly cacheService: CacheService) {}

  public static async getInstance(): Promise<AppService> {
    if (!AppService.instance) {
      const cache = caching('memory', {
        ttl: 60 * 1000,
      });

      AppService.instance = await AppService.createInstance(cache);
    }

    return AppService.instance;
  }

  public static async createInstance(
    cache?: Cache | Promise<Cache>,
  ): Promise<AppService> {
    const instance = new AppService(await CacheService.createInstance(cache));

    return instance;
  }

  public async getMessage(): Promise<string> {
    const cacheKey = `getMessage():${JSON.stringify({ delayed: true })}`;
    const delayed = await this.cacheService.get<boolean>(cacheKey);

    if (!delayed) {
      await this.delay(3 * 1000);
      await this.cacheService.set(cacheKey, true);
    }

    return 'Hello, World!';
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(void 0);
      }, ms);
    });
  }
}

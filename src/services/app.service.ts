import CacheService from './cache.service';
import { memoryStore, type Store } from 'cache-manager';

export default class AppService {
  private static instance: AppService;

  private constructor(private readonly cacheService: CacheService) {}

  public static async getInstance(): Promise<AppService> {
    if (!AppService.instance) {
      AppService.instance = await AppService.createInstance(
        memoryStore({
          ttl: 60 * 1000,
        }),
      );
    }

    return AppService.instance;
  }

  public static async createInstance(store?: Store): Promise<AppService> {
    const instance = new AppService(await CacheService.createInstance(store));

    return instance;
  }

  public async getReversedText(message: string): Promise<string> {
    const cacheKey = `app:reversed:text:${message}`;
    const cachedValue = await this.cacheService.get<string>(cacheKey);

    if (!cachedValue) {
      await this.delay(2000);
      await this.cacheService.set(
        cacheKey,
        message.split('').reverse().join(''),
      );

      return await this.getReversedText(message);
    }

    return cachedValue;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

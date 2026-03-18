import { BaseRepository } from './BaseRepository';

export abstract class BaseQueryRepository extends BaseRepository {
  protected async executeQuery<T>(
    collection: string,
    queryFn: () => Promise<T>,
    cached: boolean = false
  ): Promise<T> {
    const result = await queryFn();

    if (!cached) {
      const count = Array.isArray(result) ? result.length : 1;
      this.trackRead(collection, count, cached);
    }

    return result;
  }
}

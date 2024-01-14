import { Cache } from '../types/Cache';

export const getCacheElse = <T>(
  cacheMap: Cache<T>,
  key: string,
  elseFn: () => Promise<T>,
  options: {
    durationSeconds?: number;
  } = {}
) => {
  const cache = cacheMap.get(key);

  if (cache !== undefined && cache.cachedAt !== null && cache.cacheValue !== null) {
    const now = new Date();

    if (
      options.durationSeconds === undefined ||
      now.getTime() - cache.cachedAt.getTime() < options.durationSeconds * 1000
    ) {
      return Promise.resolve(cache.cacheValue);
    }
  }

  return elseFn().then((response) => {
    cacheMap.set(key, {
      cachedAt: new Date(),
      cacheValue: response,
    });

    return response;
  });
};

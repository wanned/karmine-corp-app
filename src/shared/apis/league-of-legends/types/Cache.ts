export type Cache<T> = Map<
  string,
  {
    cachedAt: Date | null;
    cacheValue: T | null;
  }
>;

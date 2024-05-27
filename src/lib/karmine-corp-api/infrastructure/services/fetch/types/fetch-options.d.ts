export interface FetchOptions<T> {
  headers?: Record<string, string>;
  query?: Record<string, string>;
  parseResponse?: (responseText: string) => T;
  retryHeader?: string;
  method?: string;
  body?: string;
}

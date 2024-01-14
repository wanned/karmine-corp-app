const LOL_ESPORT_API_URL = 'https://esports-api.lolesports.com/persisted/gw';
const LOL_FEED_API_URL = 'https://feed.lolesports.com/livestats/v1';

const LOL_API_KEY = '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z';

const baseMakeRequest = async <T>(
  url: `${typeof LOL_ESPORT_API_URL | typeof LOL_FEED_API_URL}/${string}`,
  params?: Record<string, string>
): Promise<T> => {
  params = {
    hl: 'en-US',
    ...params,
  };

  const urlWithParams = new URL(url);

  if (params !== undefined) {
    Object.entries(params).forEach(([key, value]) => {
      urlWithParams.searchParams.append(key, value);
    });
  }

  const response = await fetch(urlWithParams.toString(), {
    headers: {
      'x-api-key': LOL_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  if (response.status === 204) {
    return undefined as any;
  }

  return response.json();
};

const createMakeRequest = (baseUrl: typeof LOL_ESPORT_API_URL | typeof LOL_FEED_API_URL) => {
  return <T>(url: `/${string}`, params?: Record<string, string>): Promise<T> =>
    baseMakeRequest<T>(`${baseUrl}${url}`, params);
};

export const makeRequest = {
  esport: createMakeRequest(LOL_ESPORT_API_URL),
  feed: createMakeRequest(LOL_FEED_API_URL),
};

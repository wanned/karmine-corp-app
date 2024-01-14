const KARMINE_API_URL = process.env.EXPO_PUBLIC_KARMINE_API_URL;

export const makeRequest = async <T>(url: `/${string}`): Promise<T> => {
  return fetch(`${KARMINE_API_URL}${url}`).then((response) => response.json());
};

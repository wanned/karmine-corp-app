import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getGames = async (): Promise<KarmineApi.Games> => {
  return makeRequest<KarmineApi.Games>('/games');
};

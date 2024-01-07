import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getPlayers = async (): Promise<KarmineApi.Players> => {
  return makeRequest<KarmineApi.Players>('/players');
};

import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getLeaderboard = async (): Promise<KarmineApi.Leaderboard> => {
  return makeRequest<KarmineApi.Leaderboard>('/leaderboard');
};

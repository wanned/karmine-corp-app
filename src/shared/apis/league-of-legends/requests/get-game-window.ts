import { makeRequest } from '../make-request';
import { LeagueOfLegendsApi } from '../types/LeagueOfLegendsApi';

export const getGameWindow = (gameId: string, params?: { startingTime?: Date }) => {
  return makeRequest.feed<LeagueOfLegendsApi.Operations['getWindow']>(`/window/${gameId}`, {
    ...(params?.startingTime !== undefined && { startingTime: params.startingTime.toISOString() }),
  });
};

import { makeRequest } from '../make-request';
import { Cache } from '../types/Cache';
import { LeagueOfLegendsApi } from '../types/LeagueOfLegendsApi';
import { getCacheElse } from '../utils/cache';

const schedulesCacheMap: Cache<LeagueOfLegendsApi.Operations['getSchedule']> = new Map();

export const getSchedule = (params?: { leagueIds?: string[]; pageToken?: string }) => {
  const leagueId = params?.leagueIds?.join(',');
  const pageToken = params?.pageToken;

  const cacheKey = JSON.stringify({ leagueId, pageToken });

  return getCacheElse(
    schedulesCacheMap,
    cacheKey,
    () =>
      makeRequest.esport<LeagueOfLegendsApi.Operations['getSchedule']>('/getSchedule', {
        ...(params?.leagueIds !== undefined && { leagueId: params.leagueIds.join(',') }),
        ...(params?.pageToken !== undefined && { pageToken: params.pageToken }),
      }),
    { durationSeconds: 5 * 60 }
  );
};

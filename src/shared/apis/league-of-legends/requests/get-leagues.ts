import { makeRequest } from '../make-request';
import { Cache } from '../types/Cache';
import { LeagueOfLegendsApi } from '../types/LeagueOfLegendsApi';
import { getCacheElse } from '../utils/cache';

const leaguesCacheMap: Cache<LeagueOfLegendsApi.Operations['getLeagues']> = new Map();

export const getLeagues = () => {
  return getCacheElse(
    leaguesCacheMap,
    '_',
    () => makeRequest.esport<LeagueOfLegendsApi.Operations['getLeagues']>('/getLeagues'),
    { durationSeconds: 5 * 60 }
  );
};

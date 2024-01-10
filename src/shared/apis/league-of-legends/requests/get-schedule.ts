import { makeRequest } from '../make-request';
import { LeagueOfLegendsApi } from '../types/LeagueOfLegendsApi';

export const getSchedule = (params?: { leagueIds?: string[]; pageToken?: string }) => {
  return makeRequest.esport<LeagueOfLegendsApi.Operations['getSchedule']>('/getSchedule', {
    ...(params?.leagueIds !== undefined && { leagueId: params.leagueIds.join(',') }),
    ...(params?.pageToken !== undefined && { pageToken: params.pageToken }),
  });
};

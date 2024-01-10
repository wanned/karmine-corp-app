import { makeRequest } from '../make-request';
import { LeagueOfLegendsApi } from '../types/LeagueOfLegendsApi';

export const getTeams = (params?: { teamIds?: string[] }) => {
  return makeRequest.esport<LeagueOfLegendsApi.Operations['getTeams']>('/getTeams', {
    ...(params?.teamIds !== undefined && { id: params.teamIds.join(',') }),
  });
};

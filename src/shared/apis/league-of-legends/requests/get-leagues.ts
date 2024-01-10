import { makeRequest } from '../make-request';
import { LeagueOfLegendsApi } from '../types/LeagueOfLegendsApi';

export const getLeagues = () => {
  return makeRequest.esport<LeagueOfLegendsApi.Operations['getLeagues']>('/getLeagues');
};

import { makeRequest } from '../make-request';
import { LeagueOfLegendsApi } from '../types/LeagueOfLegendsApi';

export const getEventDetails = (eventId: string) => {
  return makeRequest.esport<LeagueOfLegendsApi.Operations['getEventDetails']>('/getEventDetails', {
    id: eventId,
  });
};

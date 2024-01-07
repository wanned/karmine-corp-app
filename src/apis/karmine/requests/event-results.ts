import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getEventsResults = async (): Promise<KarmineApi.EventsResults> => {
  return makeRequest<KarmineApi.EventsResults>('/events_results');
};

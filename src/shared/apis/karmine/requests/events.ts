import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getEvents = async (): Promise<KarmineApi.Events> => {
  return makeRequest<KarmineApi.Events>('/events');
};

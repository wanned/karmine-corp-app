import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getTwitch = async (): Promise<KarmineApi.Twitch> => {
  return makeRequest<KarmineApi.Twitch>('/twitch');
};

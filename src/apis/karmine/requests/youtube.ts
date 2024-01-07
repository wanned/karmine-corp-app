import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getYoutube = async (): Promise<KarmineApi.Youtube> => {
  return makeRequest<KarmineApi.Youtube>('/youtube');
};

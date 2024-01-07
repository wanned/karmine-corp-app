import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getInstagram = async (): Promise<KarmineApi.Instagram> => {
  return makeRequest<KarmineApi.Instagram>('/instagram');
};

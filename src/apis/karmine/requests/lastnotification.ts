import { makeRequest } from '../make-request';
import { KarmineApi } from '../types/KarmineApi';

export const getLastnotification = async (): Promise<KarmineApi.LastNotification> => {
  return makeRequest<KarmineApi.LastNotification>('/lastnotification');
};

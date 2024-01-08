import { KarmineApi } from '../apis/karmine/types/KarmineApi';

export interface Settings {
  language: string; // TODO: use Language type when the PR is merged
  notifications: Record<KarmineApi.CompetitionName, boolean>;
  hideSpoilers: boolean;
}

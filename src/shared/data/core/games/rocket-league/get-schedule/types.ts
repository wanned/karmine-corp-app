import { OctaneApiClient } from '~/shared/data/external-apis/octane/octane-api-client';

export type RlApiMatch = Awaited<ReturnType<OctaneApiClient['getMatches']>>['matches'][number];

import { LolEsportApiClient } from '~/shared/data/external-apis/league-of-legends/lol-esport-api-client';
import { StrafeApiClient } from '~/shared/data/external-apis/strafe/strafe-api-client';

interface ApiClients {
  lol: LolEsportApiClient;
  strafe: StrafeApiClient;
}

type ApiMethod<
  T extends keyof ApiClients,
  U extends keyof ApiClients[T],
> = ApiClients[T][U] extends (...args: any[]) => Promise<infer R> ? NonNullable<R> : never;

export type LolApiEvent = ApiMethod<'lol', 'getScheduleByLeagueIds'>['events'][number];
export type LolApiTeam = LolApiEvent['match']['teams'][number];
export type LolApiMatchDetails = ApiMethod<'lol', 'getMatchById'>;
export type LolApiGameDetails = ApiMethod<'lol', 'getGameWindow'>;

export type StrafeApiMatch = ApiMethod<'strafe', 'getCalendar'>[number];
export type StrafeApiMatchDetails = ApiMethod<'strafe', 'getMatch'>;

export interface ExternalMatch {
  lol: LolApiEvent;
  strafe: StrafeApiMatch;
}

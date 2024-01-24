import { lolEsportApiClient } from '~/shared/data/external-apis/league-of-legends/lol-esport-api-client';
import { strafeApiClient } from '~/shared/data/external-apis/strafe/strafe-api-client';

export interface ApiClients {
  lol: typeof lolEsportApiClient;
  strafe: typeof strafeApiClient;
}

type ApiMethod<
  T extends keyof ApiClients,
  U extends keyof ApiClients[T],
> = ApiClients[T][U] extends (...args: any[]) => Promise<infer R> ? NonNullable<R> : never;

export type LolApiEvent = ApiMethod<'lol', 'getScheduleByLeagueIds'>['events'][number];
export type LolApiTeam = LolApiEvent['match']['teams'][number];

export type StrafeApiMatch = ApiMethod<'strafe', 'getCalendar'>[number];

export interface ExternalMatch {
  lol: LolApiEvent;
  strafe: StrafeApiMatch;
}

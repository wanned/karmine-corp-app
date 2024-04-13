import * as v from '@badrap/valita';
import destr from 'destr';
import { Effect, Layer } from 'effect';

import { LeagueOfLegendsApiService } from './league-of-legends-api-service';
import { leagueOfLegendsApiSchemas } from './schemas/league-of-legends-api-schemas';
import { parseValita } from '../../utils/parse-valita/parse-valita';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const LeagueOfLegendsApiServiceImpl = Layer.succeed(
  LeagueOfLegendsApiService,
  LeagueOfLegendsApiService.of({
    getMatch: ({ matchId }) =>
      fetchLol({
        url: 'getEventDetails',
        type: 'esport',
        query: { id: matchId },
        schema: leagueOfLegendsApiSchemas.getMatchById,
      }),
    getTeams: () =>
      fetchLol({
        url: 'getTeams',
        type: 'esport',
        schema: leagueOfLegendsApiSchemas.getAllTeams,
      }),
    getSchedule: ({ leagueIds, pageToken }) =>
      fetchLol({
        url: 'getSchedule',
        type: 'esport',
        schema: leagueOfLegendsApiSchemas.getScheduleByLeagueIds,
        query: { leagueId: leagueIds.join(','), pageToken },
      }),
    getGameWindow: ({ gameId, startingTime }) =>
      fetchLol({
        url: `window/${gameId}`,
        type: 'feed',
        schema: leagueOfLegendsApiSchemas.getGameWindow,
        query: { startingTime: startingTime?.toISOString() },
      }),
    getVersions: () =>
      fetchLol({
        url: 'api/versions.json',
        type: 'ddragon',
        schema: leagueOfLegendsApiSchemas.getAllVersions,
      }),
    getTournaments: ({ leagueIds }) =>
      fetchLol({
        url: 'getTournamentsForLeague',
        type: 'esport',
        schema: leagueOfLegendsApiSchemas.getTournamentsForLeague,
        query: { leagueId: leagueIds.join(',') },
      }),
    getStandings: ({ tournamentId }) =>
      fetchLol({
        url: 'getStandingsV3',
        type: 'esport',
        schema: leagueOfLegendsApiSchemas.getStandingsByTournamentId,
        query: { tournamentId },
      }),
  })
);

type LEAGUE_OF_LEGENDS_API_TYPE = 'esport' | 'feed' | 'ddragon';

const getLeagueOfLegendsUrl = ({ url, type }: { url: string; type: LEAGUE_OF_LEGENDS_API_TYPE }) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map(
      (env) =>
        `${
          type === 'esport' ? env.LOL_ESPORT_API_URL
          : type === 'feed' ? env.LOL_FEED_API_URL
          : env.LOL_DATA_DRAGON_API_URL
        }/${url}`
    )
  );

const getLeagueOfLegendsHeaders = () =>
  Effect.Do.pipe(
    () => EnvService,
    Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
    Effect.map((env) => ({ 'x-api-key': env.LOL_API_KEY }))
  );

const fetchLol = <S extends v.Type = v.Type>({
  url,
  type,
  query,
  schema,
}: {
  url: string;
  type: LEAGUE_OF_LEGENDS_API_TYPE;
  query?: Record<string, any | undefined>;
  schema: S;
}) =>
  Effect.Do.pipe(
    Effect.bind('envService', () => EnvService),
    Effect.bind('url', () => getLeagueOfLegendsUrl({ url, type })),
    Effect.bind('headers', () => getLeagueOfLegendsHeaders()),
    Effect.flatMap(({ url, headers }) =>
      Effect.serviceFunction(FetchService, (_) => _.fetch<v.Infer<S>>)(url, {
        query: {
          hl: 'en-US',
          ...query,
        },
        parseResponse:
          schema &&
          ((responseText) =>
            Effect.runSync(
              parseValita(
                schema,
                destr(responseText) || undefined,
                JSON.stringify({ url, type, query })
              )
            )),
        headers,
      })
    ),
    Effect.flatMap((_) => Effect.promise(_))
  );

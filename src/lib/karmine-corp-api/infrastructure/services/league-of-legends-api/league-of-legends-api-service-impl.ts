import { Effect, Layer } from 'effect';
import { z } from 'zod';

import { LeagueOfLegendsApiService } from './league-of-legends-api-service';
import { leagueOfLegendsApiSchemas } from './schemas/league-of-legends-api-schemas';
import { parseZod } from '../../utils/parse-zod/parse-zod';
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
    () => EnvService,
    Effect.flatMap((envService) => envService.getEnv()),
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
    Effect.flatMap((envService) => envService.getEnv()),
    Effect.map((env) => ({ 'x-api-key': env.LOL_API_KEY }))
  );

const fetchLol = <S extends z.ZodType = z.ZodAny>({
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
    Effect.bind('fetchService', () => FetchService),
    Effect.bind('envService', () => EnvService),
    Effect.bind('url', () => getLeagueOfLegendsUrl({ url, type })),
    Effect.bind('headers', () => getLeagueOfLegendsHeaders()),
    Effect.flatMap(({ fetchService, url, headers }) =>
      Effect.promise(
        fetchService.fetch<z.output<S>>(url, {
          query: {
            hl: 'en-US',
            ...query,
          },
          parseResponse:
            schema &&
            ((responseText) =>
              Effect.runSync(
                parseZod(schema, JSON.parse(responseText), JSON.stringify({ url, type, query }))
              )),
          headers,
        })
      )
    )
  );

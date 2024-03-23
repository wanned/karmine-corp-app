import { Chunk, Effect, Layer, Stream } from 'effect';
import { atom, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { CoreData } from '../../application/types/core-data';
import { getSchedule } from '../../application/use-cases/get-schedule/get-schedule';
import { DatabaseService } from '../../infrastructure/services/database/database-service';
import { createOpSqliteImpl } from '../../infrastructure/services/database/op-sqlite-impl';
import { EnvService } from '../../infrastructure/services/env/env-service';
import { FetchServiceImpl } from '../../infrastructure/services/fetch/fetch-service-impl';
import { KarmineApiServiceImpl } from '../../infrastructure/services/karmine-api/karmine-api-service-impl';
import { LeagueOfLegendsApiServiceImpl } from '../../infrastructure/services/league-of-legends-api/league-of-legends-api-service-impl';
import { OctaneApiServiceImpl } from '../../infrastructure/services/octane-api/octane-api-service-impl';
import { StrafeApiServiceImpl } from '../../infrastructure/services/strafe-api/strafe-api-service-impl';

import { IsoDate } from '~/shared/types/IsoDate';

type GroupedMatches = {
  [date: IsoDate]: CoreData.Match[];
};

export const matchesAtom = atom<GroupedMatches>({});
let matchesFetchingStatus: 'idle' | 'loading' | 'initialized' | 'error' = 'idle';

export const useMatches = () => {
  const [matches, setMatches] = useAtom(matchesAtom);

  const addMatches = useCallback((matches: CoreData.Match[]) => {
    matchesFetchingStatus = 'initialized';
    setMatches((prev) => {
      const next = { ...prev };

      matches.forEach((match) => {
        const matchDate = new Date(match.date);
        const matchDay = new Date(
          matchDate.getFullYear(),
          matchDate.getMonth(),
          matchDate.getDate()
        );
        const matchDayIso = matchDay.toISOString() as IsoDate;

        if (!next[matchDayIso]) {
          next[matchDayIso] = [];
        }

        const matchIndex = next[matchDayIso].findIndex((m) => m.id === match.id);
        if (matchIndex === -1) {
          next[matchDayIso].push(match);
        } else {
          next[matchDayIso][matchIndex] = match;
        }
      });

      return next;
    });
  }, []);

  useEffect(() => {
    if (matchesFetchingStatus !== 'idle') {
      return;
    }
    matchesFetchingStatus = 'loading';

    Effect.runPromise(
      Effect.provide(
        Effect.Do.pipe(
          Effect.flatMap(() => DatabaseService.pipe(Effect.flatMap((_) => _.initializeTables()))),
          Effect.flatMap(() =>
            getSchedule().pipe(
              Stream.groupedWithin(Infinity, 1_000),
              Stream.runForEach((matches) =>
                Effect.succeed(
                  addMatches(
                    Chunk.toArray(matches).filter(
                      (match): match is Exclude<typeof match, void> => match !== undefined
                    )
                  )
                )
              )
            )
          )
        ),
        getMainLayer()
      )
    ).catch((error) => {
      console.error(error);
      matchesFetchingStatus = 'error';
    });
  }, [addMatches, matchesFetchingStatus, matchesFetchingStatus]);

  return {
    matches,
    matchesFetchingStatus,
  };
};

const getMainLayer = () =>
  Layer.mergeAll(
    LeagueOfLegendsApiServiceImpl,
    OctaneApiServiceImpl,
    KarmineApiServiceImpl,
    StrafeApiServiceImpl,
    FetchServiceImpl,
    createOpSqliteImpl('karmine-corp-api.db'),
    Layer.succeed(
      EnvService,
      EnvService.of({
        getEnv: () =>
          Effect.succeed({
            OCTANE_API_URL: 'https://zsr.octane.gg',
            LOL_ESPORT_API_URL: 'https://esports-api.lolesports.com/persisted/gw',
            LOL_FEED_API_URL: 'https://feed.lolesports.com/livestats/v1',
            LOL_DATA_DRAGON_API_URL: 'https://ddragon.leagueoflegends.com',
            LOL_API_KEY: '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
            STRAFE_API_URL: 'https://flask-api.strafe.com',
            STRAFE_API_KEY:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMDAwLCJpYXQiOjE2MTE2NTM0MzcuMzMzMDU5fQ.n9StQPQdpNIx3E4FKFntFuzKWolstKJRd-T4LwXmfmo',
            KARMINE_API_URL: 'https://api2.kametotv.fr/karmine',
            LIQUIPEDIA_PARSE_API_URL: 'https://liquipedia.net/<GAME>/api.php',
            LIQUIPEDIA_PARSE_URL_GAME_REPLACER: '<GAME>',
            YOUTUBE_API_URL: 'https://www.youtube.com',
          }),
      })
    )
  );

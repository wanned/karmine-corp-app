import { useStore } from '@nanostores/react';
import { subHours, addHours } from 'date-fns';
import { Chunk, Effect, Schedule, Stream } from 'effect';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { atom } from 'nanostores';
import { useEffect } from 'react';

import { mainLayer } from './utils/main-layer';
import matchesDump from '../../../../../assets/matches-dump.json';
import { CoreData } from '../../application/types/core-data';
import { getSchedule } from '../../application/use-cases/get-schedule/get-schedule';
import { createGetScheduleParamsStateImpl } from '../../application/use-cases/get-schedule/get-schedule-params-state';
import { DatabaseService } from '../../infrastructure/services/database/database-service';
import { concatLazyStream } from '../../infrastructure/utils/effect/concat-lazy-stream';
import { delayedStream } from '../../infrastructure/utils/effect/delayed-stream';

import { IsoDate } from '~/shared/types/IsoDate';

type GroupedMatches = {
  [date: IsoDate]: CoreData.Match[];
};

export const matchesAtom = atom<GroupedMatches>(matchesDump as unknown as GroupedMatches);
const matchesFetchingStatusAtom = atom<'idle' | 'loading' | 'initialized' | 'error'>('idle');

const addMatches = (matches: CoreData.Match[]) => {
  matchesFetchingStatusAtom.set('initialized');
  matchesAtom.set(
    (() => {
      const prev = matchesAtom.get();
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
    })()
  );
};

const fetchMatches = async () => {
  await Effect.runPromise(
    Effect.Do.pipe(
      _getSchedule,
      Effect.flatMap(
        Stream.runForEach((matches) =>
          Effect.Do.pipe(
            Effect.map(() => matches),
            Effect.map(Chunk.toArray),
            Effect.map(addMatches)
          )
        )
      )
    )
  ).catch((error) => {
    console.error(error);
    matchesFetchingStatusAtom.set('error');
  });
};

const BACKGROUND_FETCH_MATCHES_TASK = 'BACKGROUND_FETCH_MATCHES_TASK';
TaskManager.defineTask(BACKGROUND_FETCH_MATCHES_TASK, async () => {
  await fetchMatches();
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export const useMatches = () => {
  const [matchesFetchingStatus] = useStore(matchesFetchingStatusAtom);

  useEffect(() => {
    if (matchesFetchingStatusAtom.get() !== 'idle') {
      return;
    }
    matchesFetchingStatusAtom.set('loading');
    fetchMatches();
  }, []);

  useEffect(() => {
    // Instantly run the task if it's not running
    (async () => {
      const status = await BackgroundFetch.getStatusAsync();
      if (status !== BackgroundFetch.BackgroundFetchStatus.Available) {
        return;
      }

      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_MATCHES_TASK, {
        minimumInterval: Infinity, // Run only once
        // TODO: Check that setting minimumInterval to Infinity is correct
      });
    })();
  }, []);

  return {
    matchesFetchingStatus,
  };
};

// Strategy for fetching matches: (x.y, where all same x are done in parallel)
// 1.1 Fetch matches from the database.
// 1.2 Fetch matches in live. As there is no way to know if a match is live, fetch matches in range of -12h to +12h. (repeat every 1 minute)
// 1.3 Fetch future matches. As there is no way to know if a match is future, fetch matches in range of -12h to ++. (repeat every 1 minute)
// 2.1 Fetch past matches. Pass as `ignore` the matches that are already in the database.

const getCachedSchedule = () =>
  getSchedule({ onlyFromDatabase: true }).pipe(
    Stream.provideSomeLayer(createGetScheduleParamsStateImpl({}))
  );

const getLiveSchedule = () =>
  getSchedule().pipe(
    Stream.provideSomeLayer(
      createGetScheduleParamsStateImpl({
        dateRange: { start: subHours(new Date(), 12), end: addHours(new Date(), 12) },
      })
    )
  );

const getFutureSchedule = () =>
  getSchedule().pipe(
    Stream.provideSomeLayer(
      createGetScheduleParamsStateImpl({
        dateRange: { start: subHours(new Date(), 12) },
      })
    )
  );

const getRemainingSchedule = () =>
  getCachedSchedule().pipe(
    Stream.runCollect,
    Stream.flatMap((matches) =>
      Stream.provideSomeLayer(
        getSchedule(),
        createGetScheduleParamsStateImpl({
          ignoreIds: matches.pipe(
            Chunk.filter((match) => match.status === 'finished'),
            Chunk.map((match) => match.id),
            Chunk.toArray
          ),
        })
      )
    ),
    Stream.provideSomeLayer(createGetScheduleParamsStateImpl({}))
  );

const _getSchedule = () =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(DatabaseService, (_) => _.initializeTables)()
    ),
    Effect.map(() =>
      concatLazyStream(
        () => getCachedSchedule(),
        () => getLiveSchedule(),
        () => getFutureSchedule(),
        () =>
          Stream.mergeAll(
            [
              getRemainingSchedule(),
              delayedStream(
                Stream.repeat(getLiveSchedule(), Schedule.spaced('1 minute')),
                '1 minute'
              ),
              delayedStream(
                Stream.repeat(getFutureSchedule(), Schedule.spaced('1 minute')),
                '1 minute'
              ),
            ],
            {
              concurrency: 'unbounded',
            }
          )
      ).pipe(Stream.provideSomeLayer(mainLayer), Stream.groupedWithin(100, 1_000))
    ),
    Effect.provide(mainLayer)
  );

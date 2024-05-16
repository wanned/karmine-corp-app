import { subHours, addHours } from 'date-fns';
import { Chunk, Effect, Schedule, Stream } from 'effect';
import { atom, useAtom, useStore } from 'jotai';
import { useCallback, useEffect } from 'react';

import { mainLayer } from './utils/main-layer';
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

export const matchesAtom = atom<GroupedMatches>({});
const matchesFetchingStatusAtom = atom<'idle' | 'loading' | 'initialized' | 'error'>('idle');

export const useMatches = () => {
  const [matches, setMatches] = useAtom(matchesAtom);
  const [matchesFetchingStatus] = useAtom(matchesFetchingStatusAtom);

  const store = useStore();

  const addMatches = useCallback((matches: CoreData.Match[]) => {
    store.set(matchesFetchingStatusAtom, 'initialized');
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
    if (store.get(matchesFetchingStatusAtom) !== 'idle') {
      return;
    }
    store.set(matchesFetchingStatusAtom, 'loading');

    const abortController = new AbortController();

    Effect.runPromise(
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
      ),
      { signal: abortController.signal }
    ).catch((error) => {
      console.error(error);
      store.set(matchesFetchingStatusAtom, 'error');
    });

    return () => {
      abortController.abort();
    };
  }, [addMatches, store]);

  return {
    matches,
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

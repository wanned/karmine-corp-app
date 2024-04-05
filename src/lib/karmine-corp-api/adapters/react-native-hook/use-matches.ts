import { Chunk, Effect, Layer, Stream } from 'effect';
import { atom, useAtom, useStore } from 'jotai';
import { useCallback, useEffect } from 'react';

import { mainLayer } from './utils/main-layer';
import { CoreData } from '../../application/types/core-data';
import { getSchedule } from '../../application/use-cases/get-schedule/get-schedule';
import { GetScheduleParamsState } from '../../application/use-cases/get-schedule/get-schedule-params-state';
import { DatabaseService } from '../../infrastructure/services/database/database-service';

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

    Effect.runPromise(
      Effect.provide(
        Effect.Do.pipe(
          Effect.flatMap(() =>
            Effect.serviceFunctionEffect(DatabaseService, (_) => _.initializeTables)()
          ),
          Effect.flatMap(() =>
            getSchedule().pipe(
              Stream.groupedWithin(Infinity, 1_000),
              Stream.runForEach((matches) => Effect.succeed(addMatches(Chunk.toArray(matches))))
            )
          )
        ),
        mainLayer.pipe(
          Layer.merge(Layer.succeed(GetScheduleParamsState, GetScheduleParamsState.of({})))
        )
      )
    ).catch((error) => {
      console.error(error);
      store.set(matchesFetchingStatusAtom, 'error');
    });
  }, [addMatches, store]);

  return {
    matches,
    matchesFetchingStatus,
  };
};

// const getMatches = () =>
//   Stream.empty.pipe(
//     Stream.merge(getLiveMatches()),
//     Stream.merge(getFutureMatches()),
//     Stream.merge(getPastMatches()),
//     Stream.groupedWithin(Infinity, 1_000),
//     Stream.merge(
//       getSchedule({ onlyFromDatabase: true }).pipe(
//         Stream.provideSomeLayer(createGetScheduleParamsStateImpl({})),
//         Stream.runCollect
//       )
//     )
//   );

// const getLiveMatches = () => {
//   return Stream.Do.pipe(
//     Stream.flatMap(() => getSchedule()),
//     Stream.repeat(Schedule.spaced('1 minute')),
//     Stream.provideSomeLayer(
//       createGetScheduleParamsStateImpl({
//         dateRange: {
//           // We want to get matches that have started 12 hours ago and will start in the next 12 hours
//           start: new Date(new Date().getTime() - 12 * 60 * 60 * 1000),
//           end: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
//         },
//       })
//     )
//   );
// };

// const getFutureMatches = () =>
//   Stream.Do.pipe(
//     Stream.flatMap(getSchedule),
//     Stream.repeat(Schedule.spaced('15 minutes')),
//     Stream.provideSomeLayer(
//       createGetScheduleParamsStateImpl({
//         dateRange: { start: new Date() },
//       })
//     )
//   );

// const getPastMatches = () =>
//   Stream.Do.pipe(
//     Stream.flatMap(getSchedule),
//     Stream.provideSomeLayer(
//       createGetScheduleParamsStateImpl({
//         dateRange: { end: new Date() },
//       })
//     )
//   );

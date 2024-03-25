import { Chunk, Effect, Stream } from 'effect';
import { atom, useAtom, useStore } from 'jotai';
import { useCallback, useEffect } from 'react';

import { mainLayer } from './utils/main-layer';
import { CoreData } from '../../application/types/core-data';
import { getSchedule } from '../../application/use-cases/get-schedule/get-schedule';
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
        mainLayer
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

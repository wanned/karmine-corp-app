import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { InteractionManager } from 'react-native';

import { CoreData } from '~/shared/data/core/types';
import { IsoDate } from '~/shared/types/IsoDate';
import { atomWithAsyncStorage } from '~/shared/utils/atom-with-async-storage';

type GroupedMatches = {
  [date: IsoDate]: CoreData.Match[];
};

export const groupedMatchesAtom = atomWithAsyncStorage<GroupedMatches>('grouped-matches', {});

export const useGroupedMatches = () => {
  const [groupedMatches] = useAtom(groupedMatchesAtom);
  return groupedMatches;
};

export const useAddMatches = () => {
  const setGroupedMatches = useSetAtom(groupedMatchesAtom);

  const addMatches = useCallback(
    (...matches: CoreData.Match[]) => {
      InteractionManager.runAfterInteractions(() => {
        setGroupedMatches((prevGroupedMatches) => {
          const newGroupedMatches = { ...prevGroupedMatches };

          matches.forEach((match) => {
            const matchDate = new Date(match.date);
            const matchDay = new Date(
              matchDate.getFullYear(),
              matchDate.getMonth(),
              matchDate.getDate()
            );
            const matchDayIso = matchDay.toISOString() as IsoDate;

            if (!newGroupedMatches[matchDayIso]) {
              newGroupedMatches[matchDayIso] = [];
            }

            const matchIndex = newGroupedMatches[matchDayIso].findIndex((m) => m.id === match.id);

            if (matchIndex === -1) {
              newGroupedMatches[matchDayIso].push(match);
            } else {
              newGroupedMatches[matchDayIso][matchIndex] = match;
            }

            newGroupedMatches[matchDayIso] = [...newGroupedMatches[matchDayIso]];
          });

          return newGroupedMatches;
        });
      });
    },
    [setGroupedMatches]
  );

  return addMatches;
};

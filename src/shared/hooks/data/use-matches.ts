import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

import { CoreData } from '~/shared/data/core/types';
import { IsoDate } from '~/shared/types/IsoDate';

export const groupedMatchesAtom = atom<{
  [date: IsoDate]: CoreData.Match[];
}>({});

export const useGroupedMatches = () => {
  const [groupedMatches] = useAtom(groupedMatchesAtom);
  return groupedMatches;
};

export const useAddMatches = () => {
  const [, setGroupedMatches] = useAtom(groupedMatchesAtom);

  const addMatches = useCallback(
    (...matches: CoreData.Match[]) => {
      setGroupedMatches((prevGroupedMatches) => {
        const newGroupedMatches = { ...prevGroupedMatches };

        matches.forEach((match) => {
          const matchDate = match.date;
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
    },
    [setGroupedMatches]
  );

  return addMatches;
};

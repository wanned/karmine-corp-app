import { atom, useSetAtom } from 'jotai';
import memoize from 'just-memoize';
import { useEffect, useMemo } from 'react';

import { getComparableDay } from '../utils/get-comparable-day';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { IsoDate } from '~/shared/types/IsoDate';

export const daysAtom = atom<string[]>([]);
export const matchDaysAtom = atom<{ [date: string]: CoreData.Match[] }>({});
export const daysHavingMatchAtom = atom((get) => {
  const matchs = get(matchDaysAtom);
  const daysWithMatch = Object.keys(matchs);

  return daysWithMatch.sort();
});

export const selectedDateAtom = atom<string>(getComparableDay(new Date()));
export const selectedIndexWithNoMatchAtom = atom<number | null>((get) => {
  const days = get(daysAtom);
  const selectedDate = get(selectedDateAtom);

  const index = days.findIndex((day) => day === selectedDate);

  return index === -1 ? null : index;
});
export const selectedIndexOnlyWithMatchAtom = atom<number | null>((get) => {
  const daysWithMatch = get(daysHavingMatchAtom);
  const selectedDate = get(selectedDateAtom);

  const index = daysWithMatch.findIndex((day) => day === selectedDate);

  return index === -1 ? null : index;
});

export const useInitCalendar = (groupedMatches: { [date: IsoDate]: CoreData.Match[] }) => {
  const setDays = useSetAtom(daysAtom);
  const setMatchDays = useSetAtom(matchDaysAtom);

  const matchDays = useMemo(() => {
    const matchDays = Object.fromEntries(
      Object.entries(groupedMatches).map(([date, matches]) => [
        getComparableDay(new Date(date)),
        matches,
      ])
    );

    const today = new Date();
    const todayStr = getComparableDay(today);

    if (!matchDays[todayStr]) {
      matchDays[todayStr] = [];
    }

    return matchDays;
  }, [groupedMatches]);

  useEffect(() => {
    const sortedDates = Object.keys(groupedMatches).sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    setDays(generateDatesInRange(startDate, endDate));

    setMatchDays(matchDays);
  }, [groupedMatches, setDays, setMatchDays, matchDays]);
};

const generateDatesInRange = memoize((startDateStr: string, endDateStr: string) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  // We need to set the hours to 12:00:00 to avoid issues with daylight saving time
  start.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);

  const dates = [];
  const ONE_DAY = 86_400_000;
  for (let i = start.getTime(); i <= end.getTime(); i += ONE_DAY) {
    const date = new Date(i);
    const comparableDate = getComparableDay(date);
    dates.push(comparableDate);
  }

  return dates;
});

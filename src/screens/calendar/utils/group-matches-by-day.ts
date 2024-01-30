import { Match } from '~/shared/types/data/Matchs';
import { isSameDay } from '~/shared/utils/is-same-day';

export type GroupedMatchesByDay = [Date, Match[]][];

export const groupMatchesByDay = (matches: (Match | undefined)[]): GroupedMatchesByDay => {
  const groupedMatches: GroupedMatchesByDay = [];

  matches.forEach((match) => {
    if (!match) {
      return;
    }

    const matchDate = match.date;
    const matchDay = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());

    const matchDayIndex = groupedMatches.findIndex(([day]) => isSameDay(day, matchDay));

    if (matchDayIndex === -1) {
      groupedMatches.push([matchDay, [match]]);
    } else {
      groupedMatches[matchDayIndex][1].push(match);
    }
  });

  if (!groupedMatches.some(([date]) => isSameDay(date, new Date()))) {
    groupedMatches.push([new Date(), []]);
  }

  groupedMatches.sort(([day1], [day2]) => day1.getTime() - day2.getTime());

  return groupedMatches;
};

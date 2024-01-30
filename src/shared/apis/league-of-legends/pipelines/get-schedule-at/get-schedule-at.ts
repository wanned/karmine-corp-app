import { leagueOfLegendsApi } from '../../league-of-legends-api';

import { isSameDay } from '~/shared/utils/is-same-day';

export const getScheduleAt = async (date: Date, params: { leagueIds?: string[] }) => {
  const dateSchedule: Awaited<ReturnType<typeof leagueOfLegendsApi.getSchedule>> = {
    data: {
      schedule: {
        pages: { newer: null, older: null },
        updated: new Date().toISOString(),
        events: [],
      },
    },
  };

  let currentSchedule = await leagueOfLegendsApi.getSchedule({
    leagueIds: params.leagueIds,
  });

  const tokensUsed = new Set<string>();

  for (;;) {
    currentSchedule.data.schedule.events.forEach((event) => {
      if (isSameDay(new Date(event.startTime), date)) {
        dateSchedule.data.schedule.events.push(event);
      }
    });

    const minimumDate = getMinimumDate(
      currentSchedule.data.schedule.events.map((event) => new Date(event.startTime))
    );

    const olderToken = currentSchedule.data.schedule.pages.older;
    if (
      dateIsGreaterThan(minimumDate, date) &&
      olderToken !== null &&
      !tokensUsed.has(olderToken)
    ) {
      tokensUsed.add(olderToken);
      currentSchedule = await leagueOfLegendsApi.getSchedule({
        leagueIds: params.leagueIds,
        pageToken: olderToken,
      });
      continue;
    }

    const newerToken = currentSchedule.data.schedule.pages.newer;
    if (dateIsLessThan(minimumDate, date) && newerToken !== null && !tokensUsed.has(newerToken)) {
      tokensUsed.add(newerToken);
      currentSchedule = await leagueOfLegendsApi.getSchedule({
        leagueIds: params.leagueIds,
        pageToken: newerToken,
      });
      continue;
    }

    break;
  }

  return dateSchedule;
};

const dateIsGreaterThan = (date: Date, dateToCompare: Date) => {
  return date.getTime() > dateToCompare.getTime();
};

const dateIsLessThan = (date: Date, dateToCompare: Date) => {
  return date.getTime() < dateToCompare.getTime();
};

const getMinimumDate = (dates: Date[]) => {
  return dates.reduce((minimumDate, date) => {
    if (dateIsLessThan(date, minimumDate)) {
      return date;
    }

    return minimumDate;
  });
};

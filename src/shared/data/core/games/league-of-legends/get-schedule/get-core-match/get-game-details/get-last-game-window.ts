import { lolEsportApiClient } from '~/shared/data/external-apis/league-of-legends/lol-esport-api-client';

export const getLastGameWindow = async (gameId: string, eventStartDate: Date) => {
  const year = eventStartDate.getFullYear();
  const maxWindowDate = new Date(`${year}-12-31T23:59:50.000Z`);

  // disallowed window with end time less than 45 sec old
  // So we should get the current date and remove 55 sec, then round to the nearest 10 sec below
  // Then we should compare the date with the last window date and get the minimum
  const currentMinus55Sec = new Date(new Date().getTime() - 55 * 1000);
  const currentMinus55SecRounded = new Date(
    Math.floor(currentMinus55Sec.getTime() / 10000) * 10000
  );

  const lastWindowDate = new Date(
    Math.min(currentMinus55SecRounded.getTime(), maxWindowDate.getTime())
  );

  return lolEsportApiClient.getGameWindow({
    gameId,
    startingTime: lastWindowDate,
  });
};

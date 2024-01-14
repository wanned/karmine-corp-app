import { LeagueOfLegendsApi } from '../../../types/LeagueOfLegendsApi';

export const findMatch = (
  events: LeagueOfLegendsApi.Operations['getSchedule']['data']['schedule']['events'],
  { team1, team2 }: { team1: string; team2: string }
) => {
  return events.find((event) => {
    const teams = event.match.teams.map((team) => team.code);

    return teams.includes(team1) && teams.includes(team2);
  });
};

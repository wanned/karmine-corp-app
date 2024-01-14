import { LeagueOfLegendsApi } from '../../../types/LeagueOfLegendsApi';

export const findLeague = (
  leagues: LeagueOfLegendsApi.Operations['getLeagues'],
  leagueSlug: string
) => {
  return leagues.data.leagues.find((league) => league.slug === leagueSlug);
};

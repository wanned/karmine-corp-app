import { DataFetcher } from '../../../data-fetcher';

export async function getCurrentTournamentId(
  { apis }: DataFetcher.GetLeaderboardParams,
  { leagueIds }: { leagueIds: string[] }
): Promise<string> {
  const tournaments = await apis.lolEsport
    .getTournamentsForLeague(...leagueIds)
    .then(({ leagues }) => leagues.map(({ tournaments }) => tournaments))
    .then((tournaments) => tournaments.flat());

  const currentTournament = tournaments.find((tournament) => {
    const now = new Date();
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);

    return startDate <= now && now <= endDate;
  });

  if (!currentTournament) {
    return [...tournaments].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0].id;
  }

  return currentTournament.id;
}

import { Chunk, Effect, Order } from 'effect';

import { Leaderboard, parseLeaderboard } from '../parse-leaderboard/parse-leaderboard';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { LeagueOfLegendsApi } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api';
import { LeagueOfLegendsApiService } from '~/lib/karmine-corp-api/infrastructure/services/league-of-legends-api/league-of-legends-api-service';

export const getLeagueOfLegendsLeaderboards = () =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.all([
        getLeaderboardForTeam(CoreData.CompetitionName.LeagueOfLegendsLEC),
        getLeaderboardForTeam(CoreData.CompetitionName.LeagueOfLegendsLFL),
      ])
    ),
    Effect.map(([LeagueOfLegendsLEC, LeagueOfLegendsLFL]) => ({
      [CoreData.CompetitionName.LeagueOfLegendsLEC]: LeagueOfLegendsLEC,
      [CoreData.CompetitionName.LeagueOfLegendsLFL]: LeagueOfLegendsLFL,
    }))
  );

// The leagues come from the League of Legends API
// https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US
// They correspond to the leagues Karmine Corp is or could be playing in
const LOL_LEAGUES = [
  { id: '105266103462388553', slug: 'lfl', team: CoreData.CompetitionName.LeagueOfLegendsLFL },
  {
    id: '100695891328981122',
    slug: 'emea_masters',
    team: CoreData.CompetitionName.LeagueOfLegendsLFL,
  },
  { id: '98767991302996019', slug: 'lec', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '110988878756156222', slug: 'wqs', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '98767991325878492', slug: 'msi', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
  { id: '98767975604431411', slug: 'worlds', team: CoreData.CompetitionName.LeagueOfLegendsLEC },
] as const;

const getLeaderboardForTeam = (
  team: CoreData.CompetitionName.LeagueOfLegendsLEC | CoreData.CompetitionName.LeagueOfLegendsLFL
) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      getAndSortTournaments({
        leagueIds: LOL_LEAGUES.filter((league) => league.team === team).map(({ id }) => id),
      })
    ),
    Effect.flatMap((tournaments) =>
      Effect.firstSuccessOf(
        tournaments.pipe(
          Chunk.map((tournament) => ({ tournamentId: tournament.id })),
          Chunk.map(getLeaderboardForTournament)
        )
      )
    )
  );

const getLeaderboardForTournament = ({ tournamentId }: { tournamentId: string }) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(
        LeagueOfLegendsApiService,
        (_) => _.getStandings
      )({ tournamentId })
    ),
    Effect.map(({ data }) => data.standings),
    Effect.flatMap(parseLeaderboard),
    Effect.flatMap((leaderboard) => getCoreLeaderboard({ leaderboard }))
  );

const getCoreLeaderboard = ({ leaderboard }: { leaderboard: Leaderboard }) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(LeagueOfLegendsApiService, (_) => _.getTeams)()
    ),
    Effect.map(({ data: { teams } }) =>
      Object.values(leaderboard).map((leaderboardItem) => {
        const team = teams.find(({ id }) => id === leaderboardItem.teamId);

        return {
          ...leaderboardItem,
          logoUrl: team?.image.replace('http:', 'https:') ?? '',
        };
      })
    )
  );

const getAndSortTournaments = ({ leagueIds }: { leagueIds: string[] }) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(
        LeagueOfLegendsApiService,
        (_) => _.getTournaments
      )({ leagueIds })
    ),
    Effect.map(({ data }) => data.leagues.flatMap(({ tournaments }) => tournaments)),
    Effect.map(Chunk.fromIterable),
    Effect.map((tournaments) => tournaments.pipe(Chunk.sort(nearestTournamentOrder)))
  );

const nearestTournamentOrder = Order.mapInput(
  Order.number,
  (
    tournament: LeagueOfLegendsApi.GetTournaments['data']['leagues'][number]['tournaments'][number]
  ) =>
    Math.min(
      Math.abs(tournament.startDate.getTime() - new Date().getTime()),
      Math.abs(tournament.endDate.getTime() - new Date().getTime())
    )
);

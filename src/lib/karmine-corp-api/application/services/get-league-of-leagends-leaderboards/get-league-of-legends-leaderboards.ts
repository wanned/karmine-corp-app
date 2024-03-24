import { Chunk, Effect, Option, Order } from 'effect';

import { parseLeaderboard } from '../parse-leaderboard/parse-leaderboard';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
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
      getCurrentTournamentId({
        leagueIds: LOL_LEAGUES.filter((league) => league.team === team).map(({ id }) => id),
      })
    ),
    Effect.flatMap((currentTournamentId) =>
      Effect.flatMap(LeagueOfLegendsApiService, (_) =>
        _.getStandings({ tournamentId: currentTournamentId })
      )
    ),
    Effect.map(({ data }) => data.standings),
    Effect.map(parseLeaderboard),
    Effect.flatMap((leaderboard) => getCoreLeaderboard({ leaderboard }))
  );

const getCoreLeaderboard = ({
  leaderboard,
}: {
  leaderboard: ReturnType<typeof parseLeaderboard>;
}) =>
  Effect.Do.pipe(
    Effect.flatMap(() => Effect.flatMap(LeagueOfLegendsApiService, (_) => _.getTeams())),
    Effect.map(({ data: { teams } }) =>
      Object.values(leaderboard).map((leaderboardItem) => {
        const team = teams.find(({ id }) => id === leaderboardItem.teamId);

        return {
          ...leaderboardItem,
          logoUrl: team?.image ?? '',
        };
      })
    )
  );

class NoTournamentFound extends Error {
  constructor() {
    super('No tournament found');
    this.name = 'NoTournamentFound';
  }
}

const getCurrentTournamentId = ({ leagueIds }: { leagueIds: string[] }) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.flatMap(LeagueOfLegendsApiService, (_) => _.getTournaments({ leagueIds }))
    ),
    Effect.map(({ data }) => data.leagues.flatMap(({ tournaments }) => tournaments)),
    Effect.map(Chunk.fromIterable),
    Effect.map((tournaments) =>
      tournaments.pipe(
        (tournaments) =>
          Chunk.findFirst(tournaments, (tournament) => {
            const now = new Date();
            const startDate = new Date(tournament.startDate);
            const endDate = new Date(tournament.endDate);

            return startDate <= now && now <= endDate;
          }),
        Option.orElse(() =>
          tournaments.pipe(
            Chunk.sortWith((tournament) => tournament.startDate, Order.Date),
            Chunk.get(0)
          )
        )
      )
    ),
    Effect.flatMap(
      Option.match({
        onSome: (tournament) => Effect.succeed(tournament.id),
        onNone: () => Effect.fail(new NoTournamentFound()),
      })
    )
  );

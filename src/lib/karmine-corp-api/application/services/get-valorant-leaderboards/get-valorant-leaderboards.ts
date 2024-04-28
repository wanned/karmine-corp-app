import { Chunk, Effect, Order } from 'effect';

import { Leaderboard, parseLeaderboard } from '../parse-leaderboard/parse-leaderboard';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { ValorantApi } from '~/lib/karmine-corp-api/infrastructure/services/valorant-api/valorant-api';
import { ValorantApiService } from '~/lib/karmine-corp-api/infrastructure/services/valorant-api/valorant-api-service';

export const getValorantLeaderboards = () =>
  Effect.all({
    [CoreData.CompetitionName.ValorantVCT]: getLeaderboardForTeam(
      CoreData.CompetitionName.ValorantVCT
    ),
    // [CoreData.CompetitionName.ValorantVCTGC]: getLeaderboardForTeam(
    //   CoreData.CompetitionName.ValorantVCTGC
    // ),
    // Disabled for now because Riot 😡 does not update the division 2 of GC, and there is a lot of chance in the future that we
    // will not always be in the division 1 (but j'y crois 💙)
  });

// The leagues come from the League of Legends API
// https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US
// They correspond to the leagues Karmine Corp is or could be playing in
const VALO_LEAGUES = [
  {
    id: '106109559530232966',
    slug: 'vct_emea',
    team: CoreData.CompetitionName.ValorantVCT,
  },
  {
    id: '110502729229255650',
    slug: 'ascension_emea',
    team: CoreData.CompetitionName.ValorantVCT,
  },
  {
    id: '107019646737643925',
    slug: 'game_changers_emea',
    team: CoreData.CompetitionName.ValorantVCTGC,
  },
  {
    id: '107566807613828723',
    slug: 'vrl_france',
    team: CoreData.CompetitionName.ValorantVCT,
  },
  {
    id: '109222784797127274',
    slug: 'game_changers_championship',
    team: CoreData.CompetitionName.ValorantVCTGC,
  },
  {
    id: '109940824119741550',
    slug: 'vct_masters',
    team: CoreData.CompetitionName.ValorantVCT,
  },
  {
    id: '107065428097668094',
    slug: 'last_chance_qualifier_emea',
    team: CoreData.CompetitionName.ValorantVCT,
  },
  {
    id: '109551178413356399',
    slug: 'vct_lock_in',
    team: CoreData.CompetitionName.ValorantVCT,
  },
  {
    id: '107254585505459304',
    slug: 'champions',
    team: CoreData.CompetitionName.ValorantVCT,
  },
] as const;

const getLeaderboardForTeam = (
  team: CoreData.CompetitionName.ValorantVCT | CoreData.CompetitionName.ValorantVCTGC
) =>
  Effect.Do.pipe(
    Effect.map(() => VALO_LEAGUES.filter((league) => league.team === team)),
    Effect.flatMap(getTournaments),
    Effect.flatMap((tournaments) =>
      getLeaderboardForTournaments({
        tournamentIds: tournaments.map((tournament) => tournament.id),
      })
    )
  );

const getTournaments = (leaguesToFind: (typeof VALO_LEAGUES)[number][]) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(ValorantApiService, (_) => _.getAllLeagues)()
    ),
    Effect.map(({ data }) => data.leagues),
    Effect.map((leagues) =>
      leagues.filter((league) => leaguesToFind.some((l) => l.id === league.id))
    ),
    Effect.map((leagues) => leagues.flatMap((league) => league.tournaments))
  );

const getLeaderboardForTournaments = ({ tournamentIds }: { tournamentIds: string[] }) =>
  Effect.Do.pipe(
    Effect.flatMap(() =>
      Effect.serviceFunctionEffect(ValorantApiService, (_) => _.getStandings)({ tournamentIds })
    ),
    Effect.map(({ data }) => data.standings),
    Effect.map(Chunk.fromIterable),
    Effect.map(Chunk.sort(nearestDateOrder)),
    Effect.map(Chunk.reverse),
    Effect.map(Chunk.toArray),
    Effect.flatMap(parseLeaderboard),
    Effect.map((leaderboard) => ({ leaderboard })),
    Effect.map(getCoreLeaderboard)
  );

const getCoreLeaderboard = ({ leaderboard }: { leaderboard: Leaderboard }) =>
  Object.values(leaderboard)
    .map((leaderboardItem) => {
      return {
        ...leaderboardItem,
        logoUrl: leaderboardItem.logoUrl.replace('http:', 'https:'),
      };
    })
    .sort((a, b) => a.position - b.position);

const nearestDateOrder = Order.mapInput(
  Order.number,
  (standing: ValorantApi.GetStandingsByTournamentId['data']['standings'][number]) => {
    const startTime = standing.season.splits.find((split) => split.id === standing.split.id)
      ?.startTime;
    if (!startTime) return 0;

    const endTime = standing.season.splits.find((split) => split.id === standing.split.id)?.endTime;
    if (!endTime) return 0;

    return Math.min(
      Math.abs(startTime.getTime() - new Date().getTime()),
      Math.abs(endTime.getTime() - new Date().getTime())
    );
  }
);

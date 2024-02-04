import { getStatusFromMatch } from './get-status-from-match';
import { RlApiMatch } from './types';
import { DataFetcher } from '../../../data-fetcher';
import { CoreData } from '../../../types';

export async function getCoreMatch(
  { apis }: Pick<DataFetcher.GetScheduleParams, 'apis'>,
  rlApiMatch: RlApiMatch
): Promise<CoreData.RocketLeagueMatch | undefined> {
  return {
    id: `rl:${rlApiMatch._id}`,
    date: rlApiMatch.date,
    matchDetails: {
      competitionName: CoreData.CompetitionName.RocketLeague,
      bo: rlApiMatch.format.length,
      games: await getGamesFromMatch({ apis }, rlApiMatch),
      players: {
        home: await getPlayersFromMatchTeam(rlApiMatch.blue),
        away: await getPlayersFromMatchTeam(rlApiMatch.orange),
      },
    },
    status: await getStatusFromMatch(rlApiMatch),
    teams: [
      await getTeamDetailsFromMatch(rlApiMatch.blue),
      await getTeamDetailsFromMatch(rlApiMatch.orange),
    ],
    streamLink: 'kamet0', // TODO
  };
}

async function getGamesFromMatch(
  { apis }: Pick<DataFetcher.GetScheduleParams, 'apis'>,
  match: RlApiMatch
): Promise<CoreData.RocketLeagueMatch['matchDetails']['games']> {
  const { games } = await apis.octane.getMatchGames({ matchId: match._id });

  return games.map((game) =>
    game.blue.team.stats === undefined || game.orange.team.stats === undefined ?
      undefined
    : {
        teams: {
          home: {
            goals: game.blue.team.stats.core.goals,
            stops: game.blue.team.stats.core.saves,
            totalPoints: game.blue.team.stats.core.score,
          },
          away: {
            goals: game.orange.team.stats.core.goals,
            stops: game.orange.team.stats.core.saves,
            totalPoints: game.orange.team.stats.core.score,
          },
        },
      }
  );
}

async function getPlayersFromMatchTeam(
  team: RlApiMatch['blue'] | RlApiMatch['orange']
): Promise<CoreData.RocketLeagueMatch['matchDetails']['players']['home' | 'away']> {
  return team.players.map((player) => ({
    name: player.player.tag,
  }));
}

async function getTeamDetailsFromMatch(
  team: RlApiMatch['blue'] | RlApiMatch['orange']
): Promise<CoreData.RocketLeagueMatch['teams'][0]> {
  return {
    name: team.team.team.name,
    logoUrl:
      team.team.team.image ?? 'https:///medias.kametotv.fr/karmine/teams_logo/NO_TEAM_RL.png',
    score: {
      score: team.score,
      isWinner: team.winner,
      scoreType: 'gameWins',
    },
  };
}

import { parseTeamNamesFromTitle } from '../parse-match-teams/parse-match-teams';

import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { leagueOfLegendsPipelines } from '~/shared/apis/league-of-legends/league-of-legends-pipelines';
import { LeagueOfLegendsMatchDetails } from '~/shared/types/data/Matchs';

export const parseLeagueOfLegendsMatchDetails = async (
  event: KarmineApi.Events[number] & {
    competition_name:
      | KarmineApi.CompetitionName.LeagueOfLegendsLFL
      | KarmineApi.CompetitionName.LeagueOfLegendsLEC;
  }
): Promise<LeagueOfLegendsMatchDetails | null> => {
  const [team1ShortName, team2ShortName] = parseTeamNamesFromTitle(event.title);

  const matchDetails = await leagueOfLegendsPipelines.getMatchDetails({
    leagueName:
      event.competition_name === KarmineApi.CompetitionName.LeagueOfLegendsLFL ? 'lfl' : 'lec',
    date: new Date(event.start),
    team1ShortName,
    team2ShortName,
  });

  if (matchDetails === undefined) {
    return null;
  }

  type Game = NonNullable<typeof matchDetails>['windowGames'][number];

  const getPicks = (game: Game, teamColor: 'blue' | 'red') => {
    return game.gameMetadata[`${teamColor}TeamMetadata`].participantMetadata.map((participant) => ({
      champion: {
        imageUrl: `https://ddragon.leagueoflegends.com/cdn/version/img/${participant.championId}/image.full`, // TODO: Change the version
        name: participant.championId,
      },
      player: participant.summonerName, // TODO: Remove the acronym of the team
    }));
  };

  return {
    game: event.competition_name,
    games:
      matchDetails.windowGames.map((game) => ({
        draft: {
          blue: {
            picks: getPicks(game, 'blue'),
          },
          red: {
            picks: getPicks(game, 'red'),
          },
        },
        score: {
          blue: game.frames.at(-1)?.blueTeam.totalKills ?? 0,
          red: game.frames.at(-1)?.redTeam.totalKills ?? 0,
        },
      })) ?? [],
    bo: matchDetails.match.strategy.count,
    players: Object.fromEntries(
      matchDetails.teams.map((team) => [
        team.code,
        team.players.map((player) => ({
          imageUrl: player.image,
          name: player.summonerName,
          role: player.role,
        })),
      ])
    ),
  };
};

import { DataFetcher } from '../data-fetcher';
import { CoreData } from '../types';

type PlayersGroupedByGame = Partial<
  Record<CoreData.CompetitionName, { players: CoreData.KarminePlayer[] }>
>;

export async function getPlayers({
  apis,
}: DataFetcher.GetPlayersParams): Promise<PlayersGroupedByGame> {
  const currentTwitch = await apis.karmine.getTwitch();

  return apis.karmine.getPlayers().then((players) =>
    players.reduce<PlayersGroupedByGame>((groupedPlayers, player) => {
      const game = player.category_game as CoreData.CompetitionName;
      groupedPlayers[game] ??= { players: [] };

      groupedPlayers[game]!.players.push({
        name: player.friendly_name,
        imageUrl: player.twitch_picture.endsWith('default.png') ? undefined : player.twitch_picture,
        isStreaming:
          player.twitch_login !== 'undefined_player' &&
          currentTwitch.some((t) => t.twitch_login === player.twitch_login),
      });

      return groupedPlayers;
    }, {})
  );
}

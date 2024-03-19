import { DataFetcher } from '../data-fetcher';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export async function getPlayers({
  apis,
}: DataFetcher.GetPlayersParams): Promise<CoreData.KarminePlayers> {
  const currentTwitch = await apis.karmine.getTwitch();

  return apis.karmine.getPlayers().then((players) =>
    players.reduce<CoreData.KarminePlayers>((groupedPlayers, player) => {
      const game = player.category_game as CoreData.CompetitionName;
      groupedPlayers[game] ??= [];

      groupedPlayers[game]!.push({
        name: player.friendly_name,
        imageUrl: player.twitch_picture.endsWith('default.png') ? undefined : player.twitch_picture,
        isStreaming:
          player.twitch_login !== 'undefined_player' &&
          currentTwitch.some((t) => t.twitch_login === player.twitch_login),
        streamLink: `https://twitch.tv/${fixTwitchLogin(player.twitch_login)}`,
      });

      return groupedPlayers;
    }, {})
  );
}

function fixTwitchLogin(twitchLogin: string) {
  if (twitchLogin === 'atowrikowww') {
    return 'atowwwww';
  }

  return twitchLogin;
}

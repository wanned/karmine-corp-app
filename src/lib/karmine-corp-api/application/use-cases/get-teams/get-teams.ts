import { Effect } from 'effect';

import { CoreData } from '../../types/core-data';

import { KarmineApiService } from '~/lib/karmine-corp-api/infrastructure/services/karmine-api/karmine-api-service';

export const getTeams = () =>
  Effect.Do.pipe(
    Effect.bind('players', () =>
      Effect.serviceFunctionEffect(KarmineApiService, (_) => _.getPlayers)()
    ),
    Effect.bind('streamers', () =>
      Effect.serviceFunctionEffect(KarmineApiService, (_) => _.getTwitch)()
    ),
    Effect.map(({ players, streamers }) =>
      players.reduce<CoreData.KarminePlayers>((groupedPlayers, player) => {
        const game = player.category_game as CoreData.CompetitionName;
        groupedPlayers[game] ??= [];

        groupedPlayers[game]!.push({
          name: player.friendly_name,
          imageUrl:
            player.twitch_picture.endsWith('default.png') ? undefined : player.twitch_picture,
          isStreaming:
            player.twitch_login !== 'undefined_player' &&
            streamers.some((streamer) => streamer.twitch_login === player.twitch_login),
          streamLink:
            player.twitch_login !== 'undefined_player' ?
              `https://twitch.tv/${fixTwitchLogin(player.twitch_login)}`
            : undefined,
        });

        return groupedPlayers;
      }, {})
    )
  );

function fixTwitchLogin(twitchLogin: string) {
  if (twitchLogin === 'atowrikowww') {
    return 'atowwwww';
  }

  return twitchLogin;
}

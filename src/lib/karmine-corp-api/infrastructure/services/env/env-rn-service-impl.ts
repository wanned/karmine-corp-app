import { Effect, Layer } from 'effect';

import { EnvService } from './env-service';

export const EnvRnServiceImpl = Layer.succeed(
  EnvService,
  EnvService.of({
    getEnv: () =>
      Effect.succeed({
        OCTANE_API_URL: 'https://zsr.octane.gg',
        LOL_ESPORT_API_URL: 'https://esports-api.lolesports.com/persisted/gw',
        LOL_FEED_API_URL: 'https://feed.lolesports.com/livestats/v1',
        LOL_DATA_DRAGON_API_URL: 'https://ddragon.leagueoflegends.com',
        LOL_API_KEY: '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
        STRAFE_API_URL: 'https://flask-api.strafe.com',
        STRAFE_API_KEY:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMDAwLCJpYXQiOjE2MTE2NTM0MzcuMzMzMDU5fQ.n9StQPQdpNIx3E4FKFntFuzKWolstKJRd-T4LwXmfmo',
        HTML_TO_JSON_API_URL: 'https://html2json.com/api/v1',
        KARMINE_API_URL: 'https://api2.kametotv.fr/karmine',
        LIQUIPEDIA_PARSE_API_URL: 'https://liquipedia.net/<GAME>/api.php',
        LIQUIPEDIA_PARSE_URL_GAME_REPLACER: '<GAME>',
        VLR_API_URL: 'https://www.vlr.gg',
        VALORANT_API_KEY: '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
        VALORANT_API_URL: 'https://esports-api.service.valorantesports.com/persisted/val',
        VLR_GG_URL: 'https://www.vlr.gg',
        VLR_GG_API_URL: 'https://vlr.orlandomm.net/api/v1',
        YOUTUBE_API_URL: 'https://www.youtube.com',
        FIREBASE_CLIENT_EMAIL: '',
        FIREBASE_PRIVATE_KEY: '',
        FIREBASE_PROJECT_ID: '',
      }),
  })
);

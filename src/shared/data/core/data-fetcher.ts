import defu from 'defu';

import { getLeaderboard as getLeagueOfLegendsLeaderboards } from './get-leaderboard/games/league-of-legends/get-leaderboard';
import { getLeaderboard as getRocketLeagueLeaderboards } from './get-leaderboard/games/rocket-league/get-leaderboard';
import { getPlayers } from './get-teams/get-players';
import { KarmineApiClient } from '../external-apis/karmine/karmine-api-client';
import { LolEsportApiClient } from '../external-apis/league-of-legends/lol-esport-api-client';
import { LiquipediaApiClient } from '../external-apis/liquipedia/liquipedia-api-client';
import { YoutubeApiClient } from '../external-apis/youtube/youtube-api-client';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export namespace DataFetcher {
  export interface Apis {
    karmine: KarmineApiClient;
    lolEsport: LolEsportApiClient;
    liquipedia: LiquipediaApiClient;
    youtube: YoutubeApiClient;
  }

  export interface GetPlayersParams {
    apis: Apis;
  }

  export interface GetLeaderboardParams {
    onResult: (leaderboards: CoreData.Leaderboards) => void;
    apis: Apis;
  }

  export type Fetch = (
    url: string,
    options?: Parameters<typeof fetch>[1]
  ) => Promise<{
    text: string;
    status: number;
    statusText: string;
    ok: boolean;
    headers: Headers;
  }>;
}

const defaultFetch: DataFetcher.Fetch = async (...params) => {
  const response = await fetch(...params);

  return {
    text: await response.text(),
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    headers: response.headers,
  };
};

export class DataFetcher {
  private apis: DataFetcher.Apis;

  constructor({ fetch = defaultFetch }: { fetch?: DataFetcher.Fetch } = {}) {
    this.apis = {
      karmine: new KarmineApiClient({ fetch }),
      lolEsport: new LolEsportApiClient({ fetch }),
      youtube: new YoutubeApiClient({ fetch }),
      liquipedia: new LiquipediaApiClient({ fetch }),
    };
  }

  public async getPlayers(): Promise<CoreData.KarminePlayers> {
    const players = await getPlayers({ apis: this.apis });

    return defu(players);
  }

  public async getLeaderboard({
    onResult = () => {},
  }: Partial<Omit<DataFetcher.GetLeaderboardParams, 'apis'>> = {}): Promise<CoreData.Leaderboards> {
    const leaderboards = await Promise.all([
      getLeagueOfLegendsLeaderboards({ onResult, apis: this.apis }),
      getRocketLeagueLeaderboards({ onResult, apis: this.apis }),
    ]);

    return defu(...leaderboards);
  }

  public async getGames() {
    const games = await this.apis.karmine.getGames();

    return games;
  }

  public async getYoutubeVideos(): Promise<CoreData.YoutubeVideo[]> {
    const {
      feed: { entry: videos },
    } = await this.apis.youtube.getVideos();

    return videos.map((video) => ({
      id: video['yt:videoId'],
      title: video['media:group']['media:title'],
      url: `https://www.youtube.com/watch?v=${video['yt:videoId']}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${video['yt:videoId']}/maxresdefault.jpg`,
      publishedAt: video.published,
      likes: video['media:group']['media:community']['media:starRating']['@_count'],
      views: video['media:group']['media:community']['media:statistics']['@_views'],
    }));
  }
}

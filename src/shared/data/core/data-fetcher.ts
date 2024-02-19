import * as datefns from 'date-fns';
import defu from 'defu';

import { getLeaderboard as getLeagueOfLegendsLeaderboards } from './get-leaderboard/games/league-of-legends/get-leaderboard';
import { getLeaderboard as getRocketLeagueLeaderboards } from './get-leaderboard/games/rocket-league/get-leaderboard';
import { getSchedule as getAllMatches } from './get-schedule/games/all/get-schedule';
import { getSchedule as getLeagueOfLegendsMatches } from './get-schedule/games/league-of-legends/get-schedule';
import { getSchedule as getRocketLeagueMatches } from './get-schedule/games/rocket-league/get-schedule';
import { getPlayers } from './get-teams/get-players';
import { CoreData, CoreData as _CoreData } from './types';
import { KarmineApiClient } from '../external-apis/karmine/karmine-api-client';
import { LolEsportApiClient } from '../external-apis/league-of-legends/lol-esport-api-client';
import { LiquipediaApiClient } from '../external-apis/liquipedia/liquipedia-api-client';
import { OctaneApiClient } from '../external-apis/octane/octane-api-client';
import { StrafeApiClient } from '../external-apis/strafe/strafe-api-client';
import { YoutubeApiClient } from '../external-apis/youtube/youtube-api-client';

export namespace DataFetcher {
  export interface Apis {
    karmine: KarmineApiClient;
    lolEsport: LolEsportApiClient;
    strafe: StrafeApiClient;
    octane: OctaneApiClient;
    youtube: YoutubeApiClient;
    liquipedia: LiquipediaApiClient;
  }

  export interface GetScheduleParams {
    onResult: (...matches: _CoreData.Match[]) => void;
    filters: {
      status?: _CoreData.Match['status'][];
      date?: { from?: Date; to?: Date };
      notGames?: CoreData.CompetitionName[];
      games?: CoreData.CompetitionName[];
    };
    batches?: { from: Date; to: Date }[];
    apis: Apis;
  }

  export interface GetPlayersParams {
    apis: Apis;
  }

  export interface GetLeaderboardParams {
    onResult: (leaderboards: CoreData.Leaderboards) => void;
    apis: Apis;
  }

  export type Fetch = (...params: Parameters<typeof fetch>) => Promise<{
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
      strafe: new StrafeApiClient({ fetch }),
      octane: new OctaneApiClient({ fetch }),
      youtube: new YoutubeApiClient({ fetch }),
      liquipedia: new LiquipediaApiClient({ fetch }),
    };
  }

  public async getSchedule({
    onResult = () => {},
    filters = {},
    batches = [],
  }: Partial<Omit<DataFetcher.GetScheduleParams, 'apis'>> = {}): Promise<_CoreData.Match[]> {
    if (
      filters.status !== undefined &&
      filters.status.includes('upcoming') &&
      filters.status.length === 1 &&
      filters.date === undefined
    ) {
      // Automatically add a date filter for upcoming matches
      filters.date = { from: datefns.subHours(new Date(), 2) };
    }

    if (
      filters.status !== undefined &&
      filters.status.includes('live') &&
      filters.status.length === 1 &&
      filters.date === undefined
    ) {
      // Automatically add a date filter for live matches
      filters.date = {
        from: datefns.subHours(new Date(), 12),
        to: datefns.addHours(new Date(), 12),
      };
    }

    const matches = await Promise.all([
      getAllMatches({
        onResult,
        filters: {
          ...filters,
          notGames: [
            ...(filters.notGames ?? []),
            CoreData.CompetitionName.RocketLeague,
            CoreData.CompetitionName.LeagueOfLegendsLEC,
            CoreData.CompetitionName.LeagueOfLegendsLFL,
          ],
        },
        batches,
        apis: this.apis,
      }),
      getLeagueOfLegendsMatches({ onResult, filters, batches, apis: this.apis }),
      getRocketLeagueMatches({ onResult, filters, batches, apis: this.apis }),
    ]);

    return matches.flat();
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

import defu from 'defu';

import { getLeaderboardForTeam } from './get-leaderboard/games/league-of-legends/get-leaderboard-fot-team';
import { getSchedule as getAllMatches } from './get-schedule/games/all/get-schedule';
import { getSchedule as getLeagueOfLegendsMatches } from './get-schedule/games/league-of-legends/get-schedule';
import { getSchedule as getRocketLeagueMatches } from './get-schedule/games/rocket-league/get-schedule';
import { getPlayers } from './get-teams/get-players';
import { CoreData, CoreData as _CoreData } from './types';
import { KarmineApiClient } from '../external-apis/karmine/karmine-api-client';
import { LolEsportApiClient } from '../external-apis/league-of-legends/lol-esport-api-client';
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
}

export class DataFetcher {
  private apis: DataFetcher.Apis;

  constructor({ fetch_ = fetch }: { fetch_?: typeof fetch } = {}) {
    this.apis = {
      karmine: new KarmineApiClient({ fetch_ }),
      lolEsport: new LolEsportApiClient({ fetch_ }),
      strafe: new StrafeApiClient({ fetch_ }),
      octane: new OctaneApiClient({ fetch_ }),
      youtube: new YoutubeApiClient({ fetch_ }),
    };
  }

  public async getSchedule({
    onResult = () => {},
    filters = {},
    batches = [],
  }: Partial<Omit<DataFetcher.GetScheduleParams, 'apis'>> = {}): Promise<_CoreData.Match[]> {
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
    return Promise.all([
      getLeaderboardForTeam(
        { apis: this.apis, onResult },
        CoreData.CompetitionName.LeagueOfLegendsLEC
      ),
      getLeaderboardForTeam(
        { apis: this.apis, onResult },
        CoreData.CompetitionName.LeagueOfLegendsLFL
      ),
    ]).then(([LeagueOfLegendsLEC, LeagueOfLegendsLFL]) => ({
      [CoreData.CompetitionName.LeagueOfLegendsLEC]: LeagueOfLegendsLEC,
      [CoreData.CompetitionName.LeagueOfLegendsLFL]: LeagueOfLegendsLFL,
    }));
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

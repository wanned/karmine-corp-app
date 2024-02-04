import { getSchedule as getAllMatches } from './games/all/get-schedule';
import { getSchedule as getLeagueOfLegendsMatches } from './games/league-of-legends/get-schedule';
import { CoreData, CoreData as _CoreData } from './types';
import { KarmineApiClient } from '../external-apis/karmine/karmine-api-client';
import { LolEsportApiClient } from '../external-apis/league-of-legends/lol-esport-api-client';
import { StrafeApiClient } from '../external-apis/strafe/strafe-api-client';
import { YoutubeApiClient } from '../external-apis/youtube/youtube-api-client';

export namespace DataFetcher {
  export interface Apis {
    karmine: KarmineApiClient;
    lolEsport: LolEsportApiClient;
    strafe: StrafeApiClient;
  }

  export interface GetScheduleParams {
    onResult: (match: _CoreData.Match) => void;
    filters: {
      status?: _CoreData.Match['status'][];
      date?: { from?: Date; to?: Date };
    };
    batches?: { from: Date; to: Date }[];
    apis: Apis;
  }
}

export class DataFetcher {
  private fetch_: typeof fetch;

  constructor({ fetch_ = fetch }: { fetch_?: typeof fetch } = {}) {
    this.fetch_ = fetch_;
  }

  public async getSchedule({
    onResult = () => {},
    filters = {},
    batches = [],
  }: Partial<Omit<DataFetcher.GetScheduleParams, 'apis'>> = {}): Promise<_CoreData.Match[]> {
    const apis: DataFetcher.Apis = {
      karmine: new KarmineApiClient({ fetch_: this.fetch_ }),
      lolEsport: new LolEsportApiClient({ fetch_: this.fetch_ }),
      strafe: new StrafeApiClient({ fetch_: this.fetch_ }),
    };

    const matches = await Promise.all([
      getAllMatches({ onResult, filters, batches, apis }),
      getLeagueOfLegendsMatches({ onResult, filters, batches, apis }),
    ]);

    return matches.flat();
  }

  public async getYoutubeVideos(): Promise<CoreData.YoutubeVideo[]> {
    const youtubeApiClient = new YoutubeApiClient({ fetch_: this.fetch_ });

    const {
      feed: { entry: videos },
    } = await youtubeApiClient.getVideos();

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

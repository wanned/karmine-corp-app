import { KarmineApiClient } from '../external-apis/karmine/karmine-api-client';
import { YoutubeApiClient } from '../external-apis/youtube/youtube-api-client';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export namespace DataFetcher {
  export interface Apis {
    karmine: KarmineApiClient;
    youtube: YoutubeApiClient;
  }

  export interface GetPlayersParams {
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
    contentType?: string;
  }>;
}

const defaultFetch: DataFetcher.Fetch = async (...params) => {
  const response = await fetch(...params);

  return {
    text: await response.text(),
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    contentType: response.headers.get('content-type') || undefined,
  };
};

export class DataFetcher {
  private apis: DataFetcher.Apis;

  constructor({ fetch = defaultFetch }: { fetch?: DataFetcher.Fetch } = {}) {
    this.apis = {
      karmine: new KarmineApiClient({ fetch }),
      youtube: new YoutubeApiClient({ fetch }),
    };
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

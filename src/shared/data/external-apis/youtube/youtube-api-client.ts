import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';

import { youtubeApiSchemas } from './schemas/youtube-api-schemas';
import { DataFetcher } from '../../core/data-fetcher';

const KARMINE_CHANNEL_ID = 'UCW5Ma_xnAweFIXCGOAZECAA';

export class YoutubeApiClient {
  private readonly YOUTUBE_API_URL = 'https://www.youtube.com';

  private fetch: DataFetcher.Fetch;

  constructor({ fetch }: { fetch: DataFetcher.Fetch }) {
    this.fetch = fetch;
  }

  private fetchData = async <S extends z.Schema<any>>(
    url: string,
    params?: Record<string, string | undefined>,
    schema?: S
  ): Promise<z.output<S>> => {
    params = { ...params };

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      urlParams.append(key, value);
    });

    const urlWithParams = `${this.YOUTUBE_API_URL}${url}?${urlParams}`;

    const response = await this.fetch(urlWithParams);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} (${url})`);
    }

    const dataText = response.text;
    const data =
      dataText === '' ? null
      : response.headers.get('content-type')?.includes('xml') ?
        new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '@_',
        }).parse(dataText)
      : JSON.parse(dataText);

    if (schema) {
      const parseResult = schema.safeParse(data);

      if (!parseResult.success) {
        throw new Error(`${parseResult.error.message} (${url})`);
      }

      return parseResult.data;
    }

    return data;
  };

  public async getVideos() {
    const videos = await this.fetchData(
      '/feeds/videos.xml',
      {
        channel_id: KARMINE_CHANNEL_ID,
      },
      youtubeApiSchemas.getVideos
    );

    return videos;
  }
}

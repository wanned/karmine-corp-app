import { z } from 'zod';

import { DataFetcher } from '../../core/data-fetcher';

export class LiquipediaApiClient {
  private readonly GAME_REPLACER = '<GAME>';
  private readonly LIQUIPEDIA_API_URL = `https://liquipedia.net/${this.GAME_REPLACER}/api.php`;
  private readonly PARSE_ACTION = 'parse';

  private fetch: DataFetcher.Fetch;

  constructor({ fetch }: { fetch: DataFetcher.Fetch }) {
    this.fetch = fetch;
  }

  private fetchData = async (page: string, game: string) => {
    const urlParams = new URLSearchParams({
      action: this.PARSE_ACTION,
      page,
      format: 'json',
    });

    const urlWithParams = `${this.LIQUIPEDIA_API_URL.replace(
      this.GAME_REPLACER,
      game
    )}?${urlParams}`;

    const response = await this.fetch(urlWithParams);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} (${urlWithParams})`);
    }

    const dataText = response.text;

    if (dataText === '') {
      throw new Error(`Empty response (${urlWithParams})`);
    }

    const parseResult = z
      .object({
        parse: z.object({
          title: z.string(),
          pageid: z.number(),
          text: z.object({
            '*': z.string(),
          }),
          links: z.array(
            z.object({
              ns: z.number(),
              exists: z.string().optional(),
              '*': z.string(),
            })
          ),
        }),
      })
      .safeParse(JSON.parse(dataText));

    if (!parseResult.success) {
      throw new Error(`${parseResult.error.message} (${urlWithParams})`);
    }

    const data = parseResult.data;

    return data;
  };

  public async parse(page: string, game: string) {
    return this.fetchData(page, game);
  }
}

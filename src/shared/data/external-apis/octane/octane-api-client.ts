import { z } from 'zod';

import { octaneApiSchemas } from './schema/octane-api-schemas';
import { DataFetcher } from '../../core/data-fetcher';

export class OctaneApiClient {
  private OCTANE_API_URL = 'https://zsr.octane.gg';

  private fetch: DataFetcher.Fetch;

  constructor({ fetch }: { fetch: DataFetcher.Fetch }) {
    this.fetch = fetch;
  }

  private fetchData = async <S extends z.Schema<any>>(
    url: string,
    params: Record<string, string | undefined> = {},
    schema?: S
  ): Promise<z.output<S>> => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      urlParams.append(key, value);
    });

    const urlWithParams = `${this.OCTANE_API_URL}${url}?${urlParams}`;

    const response = await this.fetch(urlWithParams);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} (${urlWithParams})`);
    }

    const dataText = response.text;
    const data = dataText === '' ? null : JSON.parse(dataText); // TODO: Remove this hack. We may use Effect to catch the errors instead of modifying the data for all requests

    if (schema) {
      const parseResult = schema.safeParse(data);

      if (!parseResult.success) {
        throw new Error(`${parseResult.error.message} (${urlWithParams})`);
      }

      return parseResult.data;
    }

    return data;
  };

  public async getMatches({
    teamId,
    page,
    perPage,
  }: {
    teamId?: string;
    page?: number;
    perPage?: number;
  }) {
    return this.fetchData(
      '/matches',
      {
        team: teamId,
        page: page?.toString(),
        perPage: perPage?.toString(),
      },
      octaneApiSchemas.getMatches
    );
  }

  public async getMatchGames({ matchId }: { matchId: string }) {
    return this.fetchData(`/matches/${matchId}/games`, {}, octaneApiSchemas.getMatchGames);
  }
}

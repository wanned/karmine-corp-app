import { z } from 'zod';

import { octaneApiSchemas } from './schema/octane-api-schemas';

export class OctaneApiClient {
  private OCTANE_API_URL = 'https://zsr.octane.gg';

  private fetch_: typeof fetch;

  constructor({ fetch_ = fetch }: { fetch_?: typeof fetch } = {}) {
    this.fetch_ = fetch_;
  }

  private fetch = async <S extends z.Schema<any>>(
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

    const response = await this.fetch_(urlWithParams);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} (${urlWithParams})`);
    }

    const dataText = await response.text();
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
    return this.fetch(
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
    return this.fetch(`/matches/${matchId}/games`, {}, octaneApiSchemas.getMatchGames);
  }
}

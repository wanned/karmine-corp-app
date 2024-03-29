import { z } from 'zod';

import { lolEsportApiSchemas } from './schemas/lol-esport-api-schemas';
import { DataFetcher } from '../../core/data-fetcher';

export class LolEsportApiClient {
  private LOL_API_KEY = '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z';
  private LOL_ESPORT_API_URL = 'https://esports-api.lolesports.com/persisted/gw';
  private LOL_FEED_API_URL = 'https://feed.lolesports.com/livestats/v1';
  private LOL_DATA_DRAGON_API_URL = 'https://ddragon.leagueoflegends.com';

  private fetch: DataFetcher.Fetch;

  constructor({ fetch }: { fetch: DataFetcher.Fetch }) {
    this.fetch = fetch;
  }

  private fetchData = async <S extends z.Schema<any>>(
    url: string,
    params?: Record<string, string | undefined>,
    schema?: S
  ): Promise<z.output<S>> => {
    params = { hl: 'en-US', ...params };

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      urlParams.append(key, value);
    });

    const urlWithParams = `${url}?${urlParams}`;

    const response = await this.fetch(urlWithParams, {
      headers: { 'x-api-key': this.LOL_API_KEY },
    });

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

  public async getAllTeams() {
    const { data } = await this.fetchData(
      `${this.LOL_ESPORT_API_URL}/getTeams`,
      {},
      lolEsportApiSchemas.getAllTeams
    );

    return data.teams;
  }

  public async getTournamentsForLeague(...leagueIds: string[]) {
    const { data } = await this.fetchData(
      `${this.LOL_ESPORT_API_URL}/getTournamentsForLeague`,
      { leagueId: leagueIds.join(',') },
      lolEsportApiSchemas.getTournamentsForLeague
    );

    return data;
  }

  public async getStandingsByTournamentId(tournamentId: string) {
    const { data } = await this.fetchData(
      `${this.LOL_ESPORT_API_URL}/getStandingsV3`,
      { tournamentId },
      lolEsportApiSchemas.getStandingsByTournamentId
    );

    return data.standings;
  }
}

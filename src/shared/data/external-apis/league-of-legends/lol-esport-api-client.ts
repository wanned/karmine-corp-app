import { z } from 'zod';

import { lolEsportApiSchemas } from './schemas/lol-esport-api-schemas';

class LolEsportApiClient {
  private LOL_API_KEY = '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z';
  private LOL_ESPORT_API_URL = 'https://esports-api.lolesports.com/persisted/gw';
  private LOL_FEED_API_URL = 'https://feed.lolesports.com/livestats/v1';
  private LOL_DATA_DRAGON_API_URL = 'https://ddragon.leagueoflegends.com';

  private fetch = async <S extends z.Schema<any>>(
    url: string,
    params?: Record<string, string | undefined>,
    schema?: S
  ): Promise<z.output<S>> => {
    params = { hl: 'en-US', ...params };

    const urlWithParams = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      urlWithParams.searchParams.append(key, value);
    });

    const response = await fetch(urlWithParams, {
      headers: { 'x-api-key': this.LOL_API_KEY },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} (${urlWithParams})`);
    }

    const data = await response.json();

    if (schema) {
      const parseResult = schema.safeParse(data);

      if (!parseResult.success) {
        throw new Error(`${parseResult.error.message} (${urlWithParams})`);
      }

      return parseResult.data;
    }

    return data;
  };

  public async getMatchById(matchId: string) {
    const { data } = await this.fetch(
      `${this.LOL_ESPORT_API_URL}/getEventDetails`,
      { id: matchId },
      lolEsportApiSchemas.getMatchById
    );

    return data.event.match;
  }

  public async getAllTeams() {
    const { data } = await this.fetch(
      `${this.LOL_ESPORT_API_URL}/getTeams`,
      {},
      lolEsportApiSchemas.getAllTeams
    );

    return data.teams;
  }

  public async getScheduleByLeagueIds(
    leagueIds: string[],
    { pageToken }: { pageToken?: string } = {}
  ) {
    const { data } = await this.fetch(
      `${this.LOL_ESPORT_API_URL}/getSchedule`,
      { leagueId: leagueIds.join(','), pageToken },
      lolEsportApiSchemas.getScheduleByLeagueIds
    );

    return data.schedule;
  }

  public async getGameWindow({ gameId, startingTime }: { gameId: string; startingTime?: Date }) {
    const data = await this.fetch(
      `${this.LOL_FEED_API_URL}/window/${gameId}`,
      { startingTime: startingTime?.toISOString() },
      lolEsportApiSchemas.getGameWindow
    );

    return data;
  }

  public async getAllVersions() {
    const versions = await this.fetch(
      `${this.LOL_DATA_DRAGON_API_URL}/api/versions.json`,
      {},
      lolEsportApiSchemas.getAllVersions
    );

    return versions;
  }
}

export const lolEsportApiClient = new LolEsportApiClient();

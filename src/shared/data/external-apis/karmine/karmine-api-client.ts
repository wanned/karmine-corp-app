import { z } from 'zod';

import { karmineApiSchemas } from './schemas/karmine-api-schemas';
import { DataFetcher } from '../../core/data-fetcher';

export class KarmineApiClient {
  private readonly KARMINE_API_URL = 'https://api2.kametotv.fr/karmine';

  private fetch: DataFetcher.Fetch;

  constructor({ fetch }: { fetch: DataFetcher.Fetch }) {
    this.fetch = fetch;
  }

  private fetchData = async <S extends z.Schema<any>>(
    url: string,
    schema?: S
  ): Promise<z.output<S>> => {
    const response = await this.fetch(`${this.KARMINE_API_URL}${url}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} (${url})`);
    }

    const dataText = response.text;
    const data = dataText === '' ? null : JSON.parse(dataText); // TODO: Remove this hack. We may use Effect to catch the errors instead of modifying the data for all requests

    if (schema) {
      const parseResult = schema.safeParse(data);

      if (!parseResult.success) {
        throw new Error(`${parseResult.error.message} (${url})`);
      }

      return parseResult.data;
    }

    return data;
  };

  public async getPlayers() {
    const players = await this.fetchData('/players', karmineApiSchemas.getPlayers);

    return players;
  }

  public async getTwitch() {
    const twitch = await this.fetchData('/twitch', karmineApiSchemas.getTwitch);

    return twitch;
  }

  public async getGames() {
    const games = await this.fetchData('/games', karmineApiSchemas.getGames);

    return games;
  }
}

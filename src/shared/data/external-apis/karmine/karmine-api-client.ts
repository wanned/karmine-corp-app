import { z } from 'zod';

import { karmineApiSchemas } from './schemas/karmine-api-schemas';

export class KarmineApiClient {
  private readonly KARMINE_API_URL = 'https://api2.kametotv.fr/karmine';

  private fetch_: typeof fetch;

  constructor({ fetch_ = fetch }: { fetch_?: typeof fetch } = {}) {
    this.fetch_ = fetch_;
  }

  private fetch = async <S extends z.Schema<any>>(
    url: string,
    schema?: S
  ): Promise<z.output<S>> => {
    const response = await this.fetch_(`${this.KARMINE_API_URL}${url}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} (${url})`);
    }

    const dataText = await response.text();
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

  public async getEvents() {
    const events = await this.fetch('/events', karmineApiSchemas.getEvents);

    return events;
  }

  public async getEventsResults() {
    const eventsResults = await this.fetch('/events_results', karmineApiSchemas.getEventsResults);

    return eventsResults;
  }

  public async getPlayers() {
    const players = await this.fetch('/players', karmineApiSchemas.getPlayers);

    return players;
  }

  public async getTwitch() {
    const twitch = await this.fetch('/twitch', karmineApiSchemas.getTwitch);

    return twitch;
  }

  public async getGames() {
    const games = await this.fetch('/games', karmineApiSchemas.getGames);

    return games;
  }
}

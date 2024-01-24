import { z } from 'zod';

import { karmineApiSchemas } from './schemas/karmine-api-schemas';

class KarmineApiClient {
  private readonly KARMINE_API_URL = 'https://api2.kametotv.fr/karmine';

  private fetch = async <S extends z.Schema<any>>(
    url: string,
    schema?: S
  ): Promise<z.output<S>> => {
    const response = await fetch(`${this.KARMINE_API_URL}${url}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} (${url})`);
    }

    const data = await response.json();

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
}

export const karmineApiClient = new KarmineApiClient();

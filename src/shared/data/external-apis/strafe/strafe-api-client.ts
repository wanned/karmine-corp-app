import { z } from 'zod';

import { strafeApiSchemas } from './schemas/strafe-api-schemas';

export class StrafeApiClient {
  private STRAFE_API_KEY =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMDAwLCJpYXQiOjE2MTE2NTM0MzcuMzMzMDU5fQ.n9StQPQdpNIx3E4FKFntFuzKWolstKJRd-T4LwXmfmo';

  private fetch_: typeof fetch;

  constructor({ fetch_ = fetch }: { fetch_?: typeof fetch } = {}) {
    this.fetch_ = fetch_;
  }

  private async fetch<S extends z.Schema<any>>(url: string, schema?: S): Promise<z.output<S>> {
    const response = await this.fetch_(url, {
      headers: { Authorization: `Bearer ${this.STRAFE_API_KEY}` },
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');

        if (retryAfter === null) {
          throw new Error(`${response.status} ${response.statusText} (${url})`);
        }

        const retryAfterSeconds = parseInt(retryAfter, 10);

        if (isNaN(retryAfterSeconds)) {
          throw new Error(`${response.status} ${response.statusText} (${url})`);
        }

        // console.error(`${response.status} ${response.statusText} (${url})`);
        // console.info(`Waiting ${retryAfterSeconds} seconds...`);

        await new Promise((resolve) => setTimeout(resolve, retryAfterSeconds * 1000));

        return this.fetch(url, schema);
      }

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
  }

  public async getCalendar(date: Date) {
    return this.fetch(
      `https://flask-api.strafe.com/v1.7/calendar/${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`,
      strafeApiSchemas.getCalendar
    ).then(({ data }) => data);
  }

  public async getMatch(matchId: number) {
    return this.fetch(
      `https://flask-api.strafe.com/v2.2/match/${matchId}`,
      strafeApiSchemas.getMatch
    ).then(({ data }) => data.live.map(({ data }) => data));
  }
}

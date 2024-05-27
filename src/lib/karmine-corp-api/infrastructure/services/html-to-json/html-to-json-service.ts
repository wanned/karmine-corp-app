import { Context, Effect } from 'effect';

import { HtmlToJson } from './html-to-json';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

const HTML_TO_JSON_SERVICE_TAG = 'HtmlToJsonService';

export class HtmlToJsonService extends Context.Tag(HTML_TO_JSON_SERVICE_TAG)<
  HtmlToJsonService,
  {
    parse(html: string): Effect.Effect<HtmlToJson.Parse, never, FetchService | EnvService>;
  }
>() {}

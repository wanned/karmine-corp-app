import { Effect, Layer } from 'effect';

import { HtmlToJson } from './html-to-json';
import { HtmlToJsonService } from './html-to-json-service';
import { EnvService } from '../env/env-service';
import { FetchService } from '../fetch/fetch-service';

export const HtmlToJsonServiceImpl = Layer.succeed(
  HtmlToJsonService,
  HtmlToJsonService.of({
    parse: (html) =>
      Effect.Do.pipe(
        Effect.flatMap(() => Effect.serviceFunctionEffect(EnvService, (_) => _.getEnv)()),
        Effect.map((env) => env.HTML_TO_JSON_API_URL),
        Effect.flatMap((url) =>
          Effect.serviceFunction(FetchService, (_) => _.fetch<HtmlToJson.Parse>)(url, {
            method: 'POST',
            body: html,
            headers: {
              'Content-Type': 'text/html',
            },
            parseResponse: (responseText) => {
              return { json: JSON.parse(responseText).data };
            },
          })
        ),
        Effect.flatMap((_) => Effect.promise(_))
      ),
  })
);

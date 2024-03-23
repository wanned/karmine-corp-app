import { Context, Effect } from 'effect';

import { Env } from './types/env';

const ENV_SERVICE_TAG = 'EnvService';

export class EnvService extends Context.Tag(ENV_SERVICE_TAG)<
  EnvService,
  {
    getEnv(): Effect.Effect<Env, never, never>;
  }
>() {}

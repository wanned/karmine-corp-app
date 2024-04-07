import { Effect, Stream } from 'effect';

import { CoreData } from '../../types/core-data';
import { GetScheduleParamsState } from '../../use-cases/get-schedule/get-schedule-params-state';

import { MatchesRepository } from '~/lib/karmine-corp-api/infrastructure/repositories/matches/matches-repository';

export const getScheduleFromDatabase = () =>
  Stream.fromIterableEffect(
    Effect.Do.pipe(
      Effect.flatMap(() => Effect.serviceConstants(GetScheduleParamsState).dateRange),
      Effect.flatMap((dateRange) => MatchesRepository.getMatches({ dateRange }))
    )
  ).pipe(Stream.map((match) => JSON.parse(match.data) as CoreData.Match));

import { Stream } from 'effect';

import { CoreData } from '../../types/core-data';

import { MatchesRepository } from '~/lib/karmine-corp-api/infrastructure/repositories/matches/matches-repository';

export const getScheduleFromDatabase = () =>
  Stream.fromIterableEffect(MatchesRepository.getAllMatches()).pipe(
    Stream.map((match) => JSON.parse(match.data) as CoreData.Match)
  );

import { Chunk, Stream } from 'effect';

import { CoreData } from '../../types/core-data';
import { getOtherSchedule } from '../get-other-schedule/get-other-schedule';

import { isSameDay } from '~/shared/utils/is-same-day';

// TODO: This function seems to be heavy and drops the JS thread to ~0 FPS for few milliseconds. We need to optimize it.
export function getUnlistedMatches<E, R>(matchesStream: Stream.Stream<CoreData.Match, E, R>) {
  return Stream.Do.pipe(
    () => matchesStream,
    Stream.runCollect,
    Stream.flatMap((listedMatches) =>
      getOtherSchedule().pipe(
        Stream.filter(
          (unlistedMatch) =>
            unlistedMatch.matchDetails.competitionName === CoreData.CompetitionName.RocketLeague &&
            !Chunk.some(listedMatches, (listedMatch) =>
              isSameDay(new Date(listedMatch.date), new Date(unlistedMatch.date))
            )
        ),
        Stream.map((unlistedMatch) => ({
          ...unlistedMatch,
          id: `rl:${unlistedMatch.id}`,
          matchDetails: {
            ...unlistedMatch.matchDetails,
            competitionName: CoreData.CompetitionName.RocketLeague,
            games: [],
            players: {
              home: [],
              away: [],
            },
          },
        }))
      )
    )
  );
}

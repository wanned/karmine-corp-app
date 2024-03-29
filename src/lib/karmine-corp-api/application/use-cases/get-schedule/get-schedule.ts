import { Chunk, Sink, Stream } from 'effect';

import { getLeagueOfLegendsSchedule } from '../../services/get-league-of-legends-schedule/get-league-of-legends-schedule';
import { getOtherSchedule } from '../../services/get-other-schedule/get-other-schedule';
import { getRocketLeagueSchedule } from '../../services/get-rocket-league-schedule/get-rocket-league-schedule';
import { getScheduleFromDatabase } from '../../services/get-schedule-from-database/get-schedule-from-database';
import { CoreData } from '../../types/core-data';

import { MatchesRepository } from '~/lib/karmine-corp-api/infrastructure/repositories/matches/matches-repository';

export const getSchedule = () => {
  const remoteScheduleStream = Stream.merge(
    getOtherSchedule().pipe(
      Stream.filter(
        (match) =>
          match.matchDetails.competitionName !== CoreData.CompetitionName.LeagueOfLegendsLEC &&
          match.matchDetails.competitionName !== CoreData.CompetitionName.LeagueOfLegendsLFL &&
          match.matchDetails.competitionName !== CoreData.CompetitionName.RocketLeague
      )
    ),
    Stream.merge(getRocketLeagueSchedule(), getLeagueOfLegendsSchedule())
  );

  const scheduleStream = Stream.merge(remoteScheduleStream, getScheduleFromDatabase());

  return Stream.merge(
    scheduleStream,
    remoteScheduleStream.pipe(
      Stream.groupedWithin(Infinity, 1_000),
      Stream.run(
        // TODO: insertMatches is an Effect, not a Sink
        Sink.forEach((schedule) =>
          MatchesRepository.upsertMatches(
            Chunk.toArray(schedule).map((match) => ({ id: match.id, data: JSON.stringify(match) }))
          )
        )
      )
    )
  );
};

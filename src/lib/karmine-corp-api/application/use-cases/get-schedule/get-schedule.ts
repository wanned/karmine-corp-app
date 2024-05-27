import { Chunk, Sink, Stream } from 'effect';

import { getLeagueOfLegendsSchedule } from '../../services/get-league-of-legends-schedule/get-league-of-legends-schedule';
import { getOtherSchedule } from '../../services/get-other-schedule/get-other-schedule';
import { getRocketLeagueSchedule } from '../../services/get-rocket-league-schedule/get-rocket-league-schedule';
import { getScheduleFromDatabase } from '../../services/get-schedule-from-database/get-schedule-from-database';
import { getValorantSchedule } from '../../services/get-valorant-schedule/get-valorant-schedule';
import { CoreData } from '../../types/core-data';

import { MatchesRepository } from '~/lib/karmine-corp-api/infrastructure/repositories/matches/matches-repository';

export const getSchedule = ({ onlyFromDatabase }: { onlyFromDatabase?: boolean } = {}) => {
  if (onlyFromDatabase) {
    return getScheduleFromDatabase();
  }

  // TODO: Add a `speed` parameter. If `speed` is `fast`, then we use merge (because it runs in parallel), if `speed` is `slow`, then we use concat (because it runs in sequence)
  // By default, we use `fast` speed.
  // In React Native adapter, we use `fast` only at the first app open, then, if all matches are already fetched, we use `slow` speed.

  const remoteScheduleStream = Stream.empty.pipe(
    Stream.merge(
      getOtherSchedule({
        ignoreGames: [
          CoreData.CompetitionName.LeagueOfLegendsLEC,
          CoreData.CompetitionName.LeagueOfLegendsLFL,
          CoreData.CompetitionName.RocketLeague,
          CoreData.CompetitionName.ValorantVCT,
          CoreData.CompetitionName.ValorantVCTGC,
        ],
      })
    ),
    Stream.merge(getRocketLeagueSchedule()),
    Stream.merge(getLeagueOfLegendsSchedule()),
    Stream.merge(getValorantSchedule())
  );

  const scheduleStream = Stream.merge(remoteScheduleStream, getScheduleFromDatabase());

  return Stream.Do.pipe(
    Stream.flatMap(() =>
      Stream.merge(
        scheduleStream,
        remoteScheduleStream.pipe(
          Stream.groupedWithin(Infinity, 1_000),
          Stream.run(
            // TODO: insertMatches is an Effect, not a Sink
            Sink.forEach((schedule) =>
              MatchesRepository.upsertMatches(
                Chunk.toArray(schedule).map((match) => ({
                  id: match.id,
                  data: JSON.stringify(match),
                  timestamp: new Date(match.date).getTime(),
                }))
              )
            )
          )
        )
      )
    ),
    Stream.filter((match): match is Exclude<typeof match, void> => match !== undefined),
    Stream.map((match) => ({
      ...match,
      teams: match.teams.map(
        (team) =>
          team && {
            ...team,
            logoUrl:
              team.name.toLowerCase().includes('karmine') ?
                'https://medias.kametotv.fr/karmine/teams/Karmine-RocketLeague.png'
              : team.logoUrl,
          }
      ) as (typeof match)['teams'],
    }))
  );
};

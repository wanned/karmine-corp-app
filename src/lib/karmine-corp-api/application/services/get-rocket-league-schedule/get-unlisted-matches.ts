import { Effect, Stream } from 'effect';

import { paginateKarmineCorpMatches } from './paginate-karmine-corp-matches';
import { CoreData } from '../../types/core-data';
import { GetScheduleParamsState } from '../../use-cases/get-schedule/get-schedule-params-state';
import { getOtherSchedule } from '../get-other-schedule/get-other-schedule';

export function getUnlistedMatches(matchesStream: ReturnType<typeof paginateKarmineCorpMatches>) {
  return Effect.Do.pipe(
    () => matchesStream,
    Stream.runCollect,
    Effect.let('listedDates', (listedMatches) => {
      const listedDates = new Set<`${number}-${number}-${number}`>();
      for (const listedMatch of listedMatches) {
        const date = new Date(listedMatch.date);
        listedDates.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
      }
      return listedDates;
    }),
    Effect.map(({ listedDates }) =>
      Stream.Do.pipe(
        () =>
          getOtherSchedule({
            ignoreGames: Object.keys({
              Fortnite: true,
              LeagueOfLegendsLEC: true,
              LeagueOfLegendsLFL: true,
              SuperSmashBrosUltimate: true,
              TeamfightTacticsGSC: true,
              TFT: true,
              TrackMania: true,
              ValorantVCT: true,
              ValorantVCT_GC: true,
            } satisfies Record<
              Exclude<CoreData.CompetitionName, CoreData.CompetitionName.RocketLeague>,
              true
            >) as Exclude<CoreData.CompetitionName, CoreData.CompetitionName.RocketLeague>[],
          }),
        Stream.filter((unlistedMatch) => {
          const date = new Date(unlistedMatch.date);
          return !listedDates.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
        }),
        Stream.filterEffect((match) =>
          Effect.gen(function* (_) {
            // Filter by date
            const dateRange = yield* _(Effect.serviceConstants(GetScheduleParamsState).dateRange);
            if (dateRange !== undefined) {
              const date = new Date(match.date);
              if (
                (dateRange.start !== undefined && date < dateRange.start) ||
                (dateRange.end !== undefined && date > dateRange.end)
              ) {
                return false;
              }
            }

            // Filter by ignoreIds
            const ignoreIds = yield* _(Effect.serviceConstants(GetScheduleParamsState).ignoreIds);
            if (ignoreIds !== undefined) {
              const matchId = `rl:${match.id}`;
              return !ignoreIds.includes(matchId);
            }

            return true;
          })
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
    ),
    (_) => Stream.fromEffect(_),
    (_) => Stream.flatten(_)
  );
}

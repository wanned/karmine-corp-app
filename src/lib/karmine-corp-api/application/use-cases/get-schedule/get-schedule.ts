import { Effect } from 'effect';

import { getLeagueOfLegendsSchedule } from '../../services/get-league-of-legends-schedule/get-league-of-legends-schedule';
import { getOtherSchedule } from '../../services/get-other-schedule/get-other-schedule';
import { getRocketLeagueSchedule } from '../../services/get-rocket-league-schedule/get-rocket-league-schedule';
import { CoreData } from '../../types/core-data';

export const getSchedule = () =>
  Effect.Do.pipe(
    () =>
      Effect.all([getOtherSchedule(), getLeagueOfLegendsSchedule(), getRocketLeagueSchedule()], {
        concurrency: 'unbounded',
      }),
    Effect.map((schedules) => schedules.flat())
  ) satisfies Effect.Effect<CoreData.Match[], any, any>;

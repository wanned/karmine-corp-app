import { Context, Ref } from 'effect';

import { CoreData } from '../../types/core-data';

const GET_SCHEDULE_PARAMS_STATE_TAG = 'GetScheduleParamsState';

export class GetScheduleParamsState extends Context.Tag(GET_SCHEDULE_PARAMS_STATE_TAG)<
  GetScheduleParamsState,
  Ref.Ref<{
    onResult?: (...matches: CoreData.Match[]) => void;
    filters?: {
      status?: CoreData.Match['status'][];
      date?: { from?: Date; to?: Date };
      notGames?: CoreData.CompetitionName[];
      games?: CoreData.CompetitionName[];
    };
    batches?: { from: Date; to: Date }[];
  }>
>() {}

import { Context, Layer } from 'effect';

const GET_SCHEDULE_PARAMS_TAG = 'GET_SCHEDULE_PARAMS';

export class GetScheduleParamsState extends Context.Tag(GET_SCHEDULE_PARAMS_TAG)<
  GetScheduleParamsState,
  {
    dateRange?: { start?: Date; end?: Date };
    ignoreIds?: string[];
  }
>() {}

export const createGetScheduleParamsStateImpl = (state: GetScheduleParamsState['Type']) =>
  Layer.succeed(GetScheduleParamsState, GetScheduleParamsState.of(state));

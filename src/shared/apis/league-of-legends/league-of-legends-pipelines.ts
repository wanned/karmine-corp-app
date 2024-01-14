import { getAllLastWindow } from './pipelines/get-all-last-window/get-all-last-window';
import { getMatchDetails } from './pipelines/get-match-details/get-match-details';
import { getScheduleAt } from './pipelines/get-schedule-at/get-schedule-at';

export const leagueOfLegendsPipelines = {
  getAllLastWindow,
  getMatchDetails,
  getScheduleAt,
};

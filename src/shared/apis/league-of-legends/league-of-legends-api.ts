import { getEventDetails } from './requests/get-event-details';
import { getGameWindow } from './requests/get-game-window';
import { getLeagues } from './requests/get-leagues';
import { getSchedule } from './requests/get-schedule';
import { getTeams } from './requests/get-teams';

export const leagueOfLegendsApi = {
  getLeagues,
  getSchedule,
  getEventDetails,
  getGameWindow,
  getTeams,
};

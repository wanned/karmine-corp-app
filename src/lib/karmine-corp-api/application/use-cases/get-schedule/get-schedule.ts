import { Stream } from 'effect';

import { getLeagueOfLegendsSchedule } from '../../services/get-league-of-legends-schedule/get-league-of-legends-schedule';
import { getOtherSchedule } from '../../services/get-other-schedule/get-other-schedule';
import { getRocketLeagueSchedule } from '../../services/get-rocket-league-schedule/get-rocket-league-schedule';

export const getSchedule = () =>
  Stream.merge(
    getOtherSchedule(),
    Stream.merge(getRocketLeagueSchedule(), getLeagueOfLegendsSchedule())
  );

import { getSchedule as getAllMatches } from './games/all/get-schedule';
import { getSchedule as getLeagueOfLegendsMatches } from './games/league-of-legends/get-schedule';
import { CoreData as _CoreData } from './types';

class CoreData {
  public async getSchedule(onResult: (match: _CoreData.Match) => void): Promise<_CoreData.Match[]> {
    const matches = await Promise.all([
      getAllMatches(onResult),
      getLeagueOfLegendsMatches(onResult),
    ]);

    return matches.flat();
  }
}

export const coreData = new CoreData();

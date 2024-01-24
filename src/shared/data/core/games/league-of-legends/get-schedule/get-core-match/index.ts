import { ExternalMatch } from './../types';
import { getCoreStatus } from './get-core-status';
import { getMatchDetailsFromEvent } from './get-match-details';
import { getTeamsFromEvent } from './get-teams-from-event';

import { CoreData } from '~/shared/data/core/types';

export async function getCoreMatch(
  externalMatch: ExternalMatch
): Promise<CoreData.LeagueOfLegendsMatch | undefined> {
  // Get match details
  const matchDetails = await getMatchDetailsFromEvent(externalMatch);
  if (matchDetails === undefined) return undefined;

  // Get date
  const date = externalMatch.lol.startTime;

  // Get status
  const status = getCoreStatus(externalMatch.lol.state);

  // Get stream link
  const streamLink = 'kamet0'; // TODO: get from karmine api

  // Get teams
  const teams = await getTeamsFromEvent(externalMatch);

  return {
    date,
    status,
    streamLink,
    teams,
    matchDetails,
  };
}

import { parseMatchDetails } from './parse-match-details/parse-match-details';
import { parseMatchTeams } from './parse-match-teams/parse-match-teams';

import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { Match } from '~/shared/types/data/Matchs';

export const parseMatch = async <T extends KarmineApi.Events[number]>(
  event: T
): Promise<Match & { karmineEvent: T }> => {
  const teams = parseMatchTeams(event);
  const matchDetails = await parseMatchDetails(event);

  return {
    teams,
    date: new Date(event.start),
    streamLink: event.streamLink,
    matchDetails,
    karmineEvent: event,
  };
};

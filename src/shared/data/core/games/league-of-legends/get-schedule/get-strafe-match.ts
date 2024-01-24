import { LolApiEvent } from './types';

import { strafeApiClient } from '~/shared/data/external-apis/strafe/strafe-api-client';

export async function getStrafeMatch(lolApiEvent: LolApiEvent) {
  const karmineTeam = lolApiEvent.match.teams.find((team) =>
    team.name.toLowerCase().includes('karmine')
  );
  if (karmineTeam === undefined) return undefined;

  const strafeMatches = await strafeApiClient.getCalendar(lolApiEvent.startTime);

  const strafeMatch = strafeMatches?.find((match) =>
    [match.home.name, match.away.name].includes(karmineTeam.name)
  );

  return strafeMatch;
}

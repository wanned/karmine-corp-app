import { LolApiEvent } from './types';
import { DataFetcher } from '../../../data-fetcher';

export async function getStrafeMatch(
  { apis }: Pick<DataFetcher.GetScheduleParams, 'apis'>,
  lolApiEvent: LolApiEvent
) {
  const karmineTeam = lolApiEvent.match.teams.find((team) =>
    team.name.toLowerCase().includes('karmine')
  );
  if (karmineTeam === undefined) return undefined;

  const strafeMatches = await apis.strafe.getCalendar(lolApiEvent.startTime);

  const strafeMatch = strafeMatches?.find((match) =>
    [match.home.name, match.away.name].includes(karmineTeam.name)
  );

  return strafeMatch;
}

import { Stream } from 'effect';

import { convertToCoreMatch } from './convert-to-core-match/convert-to-core-match';
import { getUnlistedMatches } from './get-unlisted-matches';
import { paginateKarmineCorpMatches } from './paginate-karmine-corp-matches';

export function getRocketLeagueSchedule() {
  return Stream.Do.pipe(
    paginateKarmineCorpMatches,
    Stream.mapEffect((match) => convertToCoreMatch(match)),
    (matchesStream) => Stream.merge(matchesStream, getUnlistedMatches(matchesStream))
  );
}

import { Stream } from 'effect';

import { getListedMatches } from './get-listed-matches';
import { getUnlistedMatches } from './get-unlisted-matches';
import { paginateKarmineCorpMatches } from './paginate-karmine-corp-matches';

export function getRocketLeagueSchedule() {
  return Stream.Do.pipe(paginateKarmineCorpMatches, (rawMatchesStream) =>
    Stream.merge(getListedMatches(rawMatchesStream), getUnlistedMatches(rawMatchesStream))
  );
}

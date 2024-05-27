import { Stream } from 'effect';

import { convertToCoreMatch } from './convert-to-core-match/convert-to-core-match';
import { paginateKarmineCorpMatches } from './paginate-karmine-corp-matches';

export function getValorantSchedule() {
  return Stream.Do.pipe(
    paginateKarmineCorpMatches,
    Stream.mapEffect((match) => convertToCoreMatch(match), {
      concurrency: 5,
      unordered: true,
    })
  );
}

import { Effect, Stream } from 'effect';

import { convertToCoreMatch } from './convert-to-core-match/convert-to-core-match';
import { paginateKarmineCorpMatches } from './paginate-karmine-corp-matches';

export function getValorantSchedule() {
  return Stream.Do.pipe(
    paginateKarmineCorpMatches,
    Stream.mapEffect((match) => convertToCoreMatch(match)),
    Stream.tap(() => Effect.sleep('1 second')) // As parsing Valorant matches is relying on parsing HTML, this is a very heavy process, so we need to slow down the HTML parsing to avoid to block the JS thread
  );
}

import { RlApiMatch } from './types';
import { CoreData } from '../../../types';

export async function getStatusFromMatch(
  rlApiMatch: RlApiMatch
): Promise<CoreData.Match['status']> {
  return (
    rlApiMatch.blue.score + rlApiMatch.orange.score === 0 ? 'upcoming'
    : (
      [rlApiMatch.blue.score, rlApiMatch.orange.score].includes(
        Math.ceil(rlApiMatch.format.length / 2)
      )
    ) ?
      'finished'
    : 'live'
  );
}

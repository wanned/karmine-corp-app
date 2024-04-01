import { useMemo } from 'react';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

export const usePrintableScore = ({
  score,
}: {
  score?: CoreData.Score | undefined;
}): string | undefined => {
  return useMemo(
    () =>
      score === undefined ? undefined
      : score.scoreType === 'top' ? `TOP ${score.score}`
      : score.score.toString(),
    [score]
  );
};

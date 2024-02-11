import { DataFetcher } from '../../data-fetcher';

import { KeysExtends } from '~/shared/types/KeysExtends';

export function groupMatchByBatch<T, K extends KeysExtends<T, Date>>(
  matches: T[],
  dateField: K,
  batches: DataFetcher.GetScheduleParams['batches'] = []
) {
  const groupedMatches: Map<string, { matches: T[]; priority: number }> = new Map();

  batches.forEach(({ from, to }, index) => {
    const rangeDate = `${from.getTime()}-${to.getTime()}`;
    const matchesInDateRange = matches.filter((match) => {
      const matchDate = (match[dateField] as Date).getTime();
      return matchDate >= from.getTime() && matchDate <= to.getTime();
    });

    if (matchesInDateRange.length === 0) return;

    groupedMatches.set(rangeDate, {
      matches: matchesInDateRange,
      priority: index,
    });
  });

  const sortedBatches = Array.from(groupedMatches.values())
    .sort((a, b) => a.priority - b.priority)
    .map(({ matches }) => matches);

  const matchesNotGrouped = matches.filter((match) => {
    return !sortedBatches.some((matches) => matches.includes(match));
  });

  return [...sortedBatches, matchesNotGrouped];
}

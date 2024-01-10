import { useQueries, useQuery, queryOptions } from '@tanstack/react-query';

import { karmineApi } from '~/shared/apis/karmine/karmine-api';
import { parseMatch } from '~/shared/data/parse-matchs/parse-match';

export const useMatchs = () => {
  const { data: events } = useQuery({
    queryKey: ['karmineEvents'],
    queryFn: karmineApi.getEvents,
  });

  const results = useQueries({
    queries: events
      ? events.map((event) => {
          return queryOptions({
            queryKey: ['karmineEvent', event.id],
            queryFn: () => parseMatch(event),
          });
        })
      : [],
  });

  return results;
};

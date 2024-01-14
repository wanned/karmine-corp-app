import { useQueries, useQuery, queryOptions } from '@tanstack/react-query';

import { karmineApi } from '~/shared/apis/karmine/karmine-api';
import { parseMatch } from '~/shared/data/parse-matchs/parse-match';

export const useMatchesResults = () => {
  const { data: eventsResults } = useQuery({
    queryKey: ['karmineEventsResults'],
    queryFn: karmineApi.getEventsResults,
  });

  const results = useQueries({
    queries: eventsResults
      ? eventsResults.map((event) => {
          return queryOptions({
            queryKey: ['karmineEventResult', event.id],
            queryFn: () =>
              parseMatch({
                ...event,
                end: '' as any,
                hasNotif: 0,
                streamLink: '',
              }),
          });
        })
      : [],
  });

  return results;
};

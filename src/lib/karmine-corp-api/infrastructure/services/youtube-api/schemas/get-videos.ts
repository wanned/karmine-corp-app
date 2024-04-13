import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';
import { vNumberString } from '../../../utils/valita-types/number-string';

export const getVideosSchema = v.object({
  feed: v.object({
    entry: v.array(
      v.object({
        id: v.string(),
        'yt:videoId': v.string(),
        published: vDateString,
        'media:group': v.object({
          'media:title': v.string(),
          'media:community': v.object({
            'media:starRating': v.object({
              '@_count': vNumberString,
            }),
            'media:statistics': v.object({
              '@_views': vNumberString,
            }),
          }),
        }),
      })
    ),
  }),
});

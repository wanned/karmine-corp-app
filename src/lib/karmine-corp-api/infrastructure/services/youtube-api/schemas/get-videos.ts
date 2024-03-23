import { z } from 'zod';

export const getVideosSchema = z.object({
  feed: z.object({
    entry: z.array(
      z.object({
        id: z.string(),
        'yt:videoId': z.string(),
        published: z.coerce.date(),
        'media:group': z.object({
          'media:title': z.string(),
          'media:community': z.object({
            'media:starRating': z.object({
              '@_count': z.coerce.number(),
            }),
            'media:statistics': z.object({
              '@_views': z.coerce.number(),
            }),
          }),
        }),
      })
    ),
  }),
});

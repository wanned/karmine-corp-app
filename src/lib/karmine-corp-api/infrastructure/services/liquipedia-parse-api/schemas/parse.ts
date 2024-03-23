import { z } from 'zod';

export const parseLiquipediaSchema = z.object({
  parse: z.object({
    title: z.string(),
    pageid: z.number(),
    text: z.object({
      '*': z.string(),
    }),
    links: z.array(
      z.object({
        ns: z.number(),
        exists: z.string().optional(),
        '*': z.string(),
      })
    ),
  }),
});

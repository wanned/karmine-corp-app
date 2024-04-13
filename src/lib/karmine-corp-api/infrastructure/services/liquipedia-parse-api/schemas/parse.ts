import * as v from '@badrap/valita';

export const parseLiquipediaSchema = v.object({
  parse: v.object({
    title: v.string(),
    pageid: v.number(),
    text: v.object({
      '*': v.string(),
    }),
    links: v.array(
      v.object({
        ns: v.number(),
        exists: v.string().optional(),
        '*': v.string(),
      })
    ),
  }),
});

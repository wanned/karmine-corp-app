import * as v from '@badrap/valita';

export const getPlayerSchema = v.object({
  data: v.object({
    info: v.object({
      user: v.string(),
      img: v.string(),
    }),
  }),
});

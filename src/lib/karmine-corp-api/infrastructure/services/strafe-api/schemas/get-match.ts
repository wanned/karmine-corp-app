import * as v from '@badrap/valita';

export const getMatchSchema = v.object({
  data: v.object({
    live: v
      .array(
        v.union(
          v.object({
            key: v.literal('game-lol'),
            data: v.object({
              status: v.union(v.literal('live'), v.literal('finished')),
              index: v.number(),
              winner: v.union(v.literal('home'), v.literal('away')).nullable(),
              game: v.object({
                duration: v.number(),
              }),
            }),
          }),
          v.unknown().chain(() => v.ok(undefined))
        )
      )
      .chain((data) =>
        v.ok(data.filter((d): d is NonNullable<typeof d> => d !== null && d !== undefined))
      ),
  }),
});

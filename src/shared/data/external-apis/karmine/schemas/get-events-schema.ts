import { z } from 'zod';

const nullStringSchema = z.string().transform((x) => (x === 'null' ? null : x));

export const getEventsSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    initial: z.string(),
    competition_name: z.string(),
    team_domicile: z.union([z.string().url(), nullStringSchema]),
    team_exterieur: z.union([z.string().url(), nullStringSchema]),
    player: nullStringSchema.transform((x) => (x === null ? null : x.split(';')[0])),
    start: z.coerce.date(),
    end: z.coerce.date(),
    streamLink: z.string().nullable(),
  })
);

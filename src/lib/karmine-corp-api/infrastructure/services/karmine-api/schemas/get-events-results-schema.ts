import { z } from 'zod';

const nullStringSchema = z.string().transform((x) => (x === 'null' ? null : x));

export const getEventsResultsSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    competition_name: z.string(),
    team_domicile: z.union([z.string().url(), nullStringSchema]),
    team_exterieur: z.union([z.string().url(), nullStringSchema]),
    score_domicile: z.string(),
    score_exterieur: z.string().nullable(),
    player: nullStringSchema.transform((x) => (x === null ? null : x.split(';')[0])),
    start: z.coerce.date(),
  })
);

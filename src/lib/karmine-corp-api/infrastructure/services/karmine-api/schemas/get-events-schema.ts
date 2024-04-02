import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';
import { vNullAsString } from '../../../utils/valita-types/null-as-string';

export const getEventsSchema = v.array(
  v.object({
    id: v.number(),
    title: v.string(),
    initial: v.string(),
    competition_name: v.string(),
    team_domicile: v.union(v.string(), vNullAsString),
    team_exterieur: v.union(v.string(), vNullAsString),
    player: vNullAsString.chain((x) => (x === null ? v.ok(null) : v.ok(x.split(';')[0]))),
    start: vDateString,
    end: vDateString,
    streamLink: v.string().nullable(),
  })
);

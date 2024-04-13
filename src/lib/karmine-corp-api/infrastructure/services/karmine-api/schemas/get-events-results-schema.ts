import * as v from '@badrap/valita';

import { vDateString } from '../../../utils/valita-types/date-string';
import { vNullAsString } from '../../../utils/valita-types/null-as-string';

export const getEventsResultsSchema = v.array(
  v.object({
    id: v.number(),
    title: v.string(),
    competition_name: v.string(),
    team_domicile: v.union(v.string(), vNullAsString),
    team_exterieur: v.union(v.string(), vNullAsString),
    score_domicile: v.string(),
    score_exterieur: v.string().nullable(),
    player: vNullAsString.chain((x) => (x === null ? v.ok(null) : v.ok(x.split(';')[0]))),
    start: vDateString,
  })
);

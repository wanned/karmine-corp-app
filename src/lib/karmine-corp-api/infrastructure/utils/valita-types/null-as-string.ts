import * as v from '@badrap/valita';

export const vNullAsString = v.string().chain((s) => (s === 'null' ? v.ok(null) : v.ok(s)));

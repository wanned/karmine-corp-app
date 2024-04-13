import * as v from '@badrap/valita';

export const vDateString = v.string().chain((s) => {
  const date = new Date(s);

  if (isNaN(+date)) {
    return v.err('invalid date');
  }

  return v.ok(date);
});

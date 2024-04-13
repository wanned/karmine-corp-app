import * as v from '@badrap/valita';

export const vNumberString = v.string().chain((s) => {
  const n = Number(s);

  if (isNaN(n)) {
    return v.err('invalid number');
  }

  return v.ok(n);
});

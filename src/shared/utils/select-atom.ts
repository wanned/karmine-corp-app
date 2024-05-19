import { Atom, atom } from 'nanostores';

export const selectAtom = <T>(anAtom: Atom<T>, compare: (a: T, b: T) => boolean) => {
  const cached = atom<T>(anAtom.get());
  anAtom.listen((value) => {
    if (!compare(cached.get(), value)) {
      cached.set(value);
    }
  });
  return cached;
};

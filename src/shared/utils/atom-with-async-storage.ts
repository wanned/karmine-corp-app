import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';

export const atomWithAsyncStorage = <T>(_key: string, initialValue: T) => {
  const key = `atomWithAsyncStorage:${_key}`;

  const baseAtom = atom<T>(initialValue);
  const batchUpdates = new Set<[string, string]>();

  baseAtom.onMount = (setValue) => {
    (async () => {
      const item = await AsyncStorage.getItem(key);
      if (item === null) return;
      setValue(JSON.parse(item) as T);
    })();
  };

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: T | ((prev: T) => T)) => {
      const nextValue = typeof update === 'function' ? (update as Function)(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      batchUpdates.add([key, JSON.stringify(nextValue)]);
    }
  );

  setInterval(async () => {
    if (batchUpdates.size === 0) return;
    const updates = Array.from(batchUpdates);
    batchUpdates.clear();
    await AsyncStorage.multiSet(updates);
  }, 5_000);

  return derivedAtom;
};

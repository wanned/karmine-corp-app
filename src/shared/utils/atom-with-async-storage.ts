import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';

export const atomWithAsyncStorage = <T>(_key: string, initialValue: T) => {
  const key = `atomWithAsyncStorage:${_key}`;

  const baseAtom = atom<T>(initialValue);

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
      AsyncStorage.setItem(key, JSON.stringify(nextValue));
    }
  );

  return derivedAtom;
};

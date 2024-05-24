import * as SplashScreen from 'expo-splash-screen';
import { atom, useSetAtom, useStore } from 'jotai';
import { useCallback, useRef } from 'react';

SplashScreen.preventAutoHideAsync();

const splashScreenPromisesAtom = atom<Promise<void>[]>([]);
let isSplashScreenHidden = false;

export function useSplashScreen() {
  const setPromises = useSetAtom(splashScreenPromisesAtom);
  const waitingForPromise = useRef<Promise<any> | null>(null);

  const { get } = useStore();

  const createHideSplashScreen = useCallback(() => {
    let resolve: (value: void) => void;
    const promise = new Promise<void>((res) => {
      resolve = res;
    });

    setPromises((prev) => [...prev, promise]);

    return () => {
      resolve();

      const promises = get(splashScreenPromisesAtom);
      if (promises.length === 0) return;

      const mergedPromises = Promise.allSettled(promises);
      waitingForPromise.current = mergedPromises;

      mergedPromises.then(async (r) => {
        if (waitingForPromise.current === mergedPromises) {
          waitingForPromise.current = null;

          if (!isSplashScreenHidden) {
            isSplashScreenHidden = true;
            await SplashScreen.hideAsync();
          }
        }
      });
    };
  }, [setPromises, get]);

  return {
    createHideSplashScreen,
  };
}

// https://github.com/sindresorhus/p-limit/blob/main/index.js
// @ts-nocheck

import Queue from 'yocto-queue';

export const AsyncResource = {
  bind(fn, _type, thisArg) {
    return fn.bind(thisArg);
  },
};

export class AsyncLocalStorage {
  getStore() {
    return undefined;
  }

  run(_store, callback) {
    return callback();
  }
}

/**
Run multiple promise-returning & async functions with limited concurrency.

@param concurrency - Concurrency limit. Minimum: `1`.
@returns A `limit` function.
*/
export default function pLimit(concurrency: number): LimitFunction {
  if (
    !(
      (Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) &&
      concurrency > 0
    )
  ) {
    throw new TypeError('Expected `concurrency` to be a number from 1 and up');
  }

  const queue = new Queue();
  let activeCount = 0;

  const next = () => {
    activeCount--;

    if (queue.size > 0) {
      queue.dequeue()();
    }
  };

  const run = async (function_, resolve, arguments_) => {
    activeCount++;

    const result = (async () => function_(...arguments_))();

    resolve(result);

    try {
      await result;
    } catch {}

    next();
  };

  const enqueue = (function_, resolve, arguments_) => {
    queue.enqueue(AsyncResource.bind(run.bind(undefined, function_, resolve, arguments_)));

    (async () => {
      // This function needs to wait until the next microtask before comparing
      // `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
      // when the run function is dequeued and called. The comparison in the if-statement
      // needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
      await Promise.resolve();

      if (activeCount < concurrency && queue.size > 0) {
        queue.dequeue()();
      }
    })();
  };

  const generator = (function_, ...arguments_) =>
    new Promise((resolve) => {
      enqueue(function_, resolve, arguments_);
    });

  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount,
    },
    pendingCount: {
      get: () => queue.size,
    },
    clearQueue: {
      value() {
        queue.clear();
      },
    },
  });

  return generator;
}

export type LimitFunction = {
  /**
  The number of promises that are currently running.
  */
  readonly activeCount: number;

  /**
  The number of promises that are waiting to run (i.e. their internal `fn` was not called yet).
  */
  readonly pendingCount: number;

  /**
  Discard pending promises that are waiting to run.

  This might be useful if you want to teardown the queue at the end of your program's lifecycle or discard any function calls referencing an intermediary state of your app.

  Note: This does not cancel promises that are already running.
  */
  clearQueue: () => void;

  /**
  @param fn - Promise-returning/async function.
  @param arguments - Any arguments to pass through to `fn`. Support for passing arguments on to the `fn` is provided in order to be able to avoid creating unnecessary closures. You probably don't need this optimization unless you're pushing a lot of functions.
  @returns The promise returned by calling `fn(...arguments)`.
  */
  <Arguments extends unknown[], ReturnType>(
    fn: (...arguments_: Arguments) => PromiseLike<ReturnType> | ReturnType,
    ...arguments_: Arguments
  ): Promise<ReturnType>;
};

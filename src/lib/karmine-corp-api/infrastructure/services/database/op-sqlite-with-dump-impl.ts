import * as Database from '@op-engineering/op-sqlite';
import { Effect, Layer } from 'effect';

import { createOpSqliteImpl } from './op-sqlite-impl/op-sqlite-impl';

export const createOpSqliteWithDumpImpl = <Path extends `/assets/${string}.${string}`>(
  // dumpPath should be at the root of the assets folder
  dumpPath: Path extends `/assets/${string}/${string}` ? never : Path
) => {
  return Layer.unwrapEffect(
    Effect.promise(async () => {
      const filename = dumpPath.replace(/^\/assets\//, '');

      await Database.moveAssetsDatabase({ filename });
      return createOpSqliteImpl(filename);
    })
  );
};

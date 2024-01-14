export const assertNotEmpty = <T>(value: T[] | undefined): [T, ...T[]] => {
  if (value === undefined || value.length === 0) {
    const error: any = new Error('Value is empty');
    error.pipelineCancelled = true;
    throw error;
  }

  return value as [T, ...T[]];
};

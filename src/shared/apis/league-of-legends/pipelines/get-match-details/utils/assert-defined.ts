export const assertDefined = <T>(value: T | undefined): T => {
  if (value === undefined) {
    const error: any = new Error('Value is undefined');
    error.pipelineCancelled = true;
    throw error;
  }

  return value as NonNullable<T>;
};

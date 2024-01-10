export const filterUndefined = <T>(value: (T | undefined)[]): T[] => {
  return value.filter((v): v is T => v !== undefined);
};

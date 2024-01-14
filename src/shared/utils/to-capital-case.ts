export const toCapitalCase = (value: string) => {
  let result = '';

  value.split(' ').forEach((word, index) => {
    result +=
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase() +
      (index === value.length - 1 ? '' : ' ');
  });

  return result;
};

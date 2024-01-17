import { SingleNumber } from '../types/single-number';

export const checkSingleNumber = (
  number: number | string
): number is SingleNumber | `${SingleNumber}` => {
  if (typeof number === 'string') {
    return Number.isInteger(Number(number)) && checkSingleNumber(Number(number));
  }

  return number >= 0 && number <= 9;
};

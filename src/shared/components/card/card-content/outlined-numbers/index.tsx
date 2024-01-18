import Outlined0 from './0';
import Outlined1 from './1';
import Outlined2 from './2';
import Outlined3 from './3';
import Outlined4 from './4';
import Outlined5 from './5';
import Outlined6 from './6';
import Outlined7 from './7';
import Outlined8 from './8';
import Outlined9 from './9';
import { SingleNumber } from '../../types/single-number';

export interface OutlinedNumberSvgProps {
  size: 'small' | 'large';
}

interface OutlinedNumberProps extends OutlinedNumberSvgProps {
  children: SingleNumber | `${SingleNumber}`;
}

export const OutlinedNumber = ({ children, size }: OutlinedNumberProps) => {
  switch (Number(children)) {
    case 0:
      return <Outlined0 size={size} />;
    case 1:
      return <Outlined1 size={size} />;
    case 2:
      return <Outlined2 size={size} />;
    case 3:
      return <Outlined3 size={size} />;
    case 4:
      return <Outlined4 size={size} />;
    case 5:
      return <Outlined5 size={size} />;
    case 6:
      return <Outlined6 size={size} />;
    case 7:
      return <Outlined7 size={size} />;
    case 8:
      return <Outlined8 size={size} />;
    case 9:
      return <Outlined9 size={size} />;
    default:
      return null;
  }
};

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

export const OutlinedNumber = ({
  children,
}: {
  children: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}) => {
  switch (children) {
    case 0:
      return <Outlined0 />;
    case 1:
      return <Outlined1 />;
    case 2:
      return <Outlined2 />;
    case 3:
      return <Outlined3 />;
    case 4:
      return <Outlined4 />;
    case 5:
      return <Outlined5 />;
    case 6:
      return <Outlined6 />;
    case 7:
      return <Outlined7 />;
    case 8:
      return <Outlined8 />;
    case 9:
      return <Outlined9 />;
    default:
      return null;
  }
};

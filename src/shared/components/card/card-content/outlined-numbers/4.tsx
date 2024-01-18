import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { OutlinedNumberSvgProps } from '.';

const Svg4 = ({ size, ...props }: OutlinedNumberSvgProps & SvgProps) => (
  <Svg
    width={size === 'small' ? 25 : 40}
    height={size === 'small' ? 33 : 50}
    viewBox="0 0 25 33"
    fill="none"
    {...props}>
    <Path
      stroke="#F3F3F3"
      d="M19.82 31.5h.5v-6.68h3.18V18.4h-3.18V1.3h-7.708l-.149.224-11.34 17.1-.083.125v6.071h11.94v6.68h6.84Zm-6.84-20.085V18.8H8.399z"
    />
  </Svg>
);
export default Svg4;

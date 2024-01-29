import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { OutlinedNumberSvgProps } from '.';

const Svg7 = ({ size, ...props }: OutlinedNumberSvgProps & SvgProps) => (
  <Svg
    width={size === 'small' ? 25 : 40}
    height={size === 'small' ? 33 : 50}
    viewBox="0 0 25 33"
    fill="none"
    {...props}>
    <Path
      stroke="#F3F3F3"
      d="M1.54 1.3h-.5v6.42h12.38L5.487 30.838l-.227.662h7.596l.117-.337 8.8-25.5.027-.08V1.3H1.54Z"
    />
  </Svg>
);
export default Svg7;

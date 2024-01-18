import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { OutlinedNumberSvgProps } from '.';

const Svg1 = ({ size, ...props }: OutlinedNumberSvgProps & SvgProps) => (
  <Svg
    width={size === 'small' ? 25 : 40}
    height={size === 'small' ? 33 : 50}
    viewBox="0 0 25 33"
    fill="none"
    {...props}>
    <Path
      stroke="#F3F3F3"
      d="M1.84 5.58h-.5v7.74h.5c1.823 0 3.584-.737 5.12-1.85v13.61H.74v6.42H20.6v-6.42h-6.04V1.3H7.058l-.086.392c-.266 1.204-1.068 2.175-2.07 2.854C3.896 5.228 2.737 5.58 1.84 5.58Z"
    />
  </Svg>
);
export default Svg1;

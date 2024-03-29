import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { OutlinedNumberSvgProps } from '.';

const Svg0 = ({ size, ...props }: OutlinedNumberSvgProps & SvgProps) => (
  <Svg
    width={size === 'small' ? 25 : 40}
    height={size === 'small' ? 33 : 50}
    viewBox="0 0 25 33"
    fill="none"
    {...props}>
    <Path
      stroke="#F3F3F3"
      d="M12.42 31.72c3.63 0 6.502-1.274 8.448-3.921 1.925-2.62 2.892-6.52 2.892-11.679 0-5.433-.964-9.343-2.896-11.904C18.91 1.626 16.031.5 12.42.5S5.925 1.626 3.966 4.216C2.03 6.776 1.06 10.687 1.06 16.12c0 5.16.972 9.059 2.902 11.68 1.95 2.646 4.829 3.92 8.458 3.92Zm0-6.66c-.732 0-1.285-.132-1.717-.395-.426-.26-.783-.678-1.07-1.339-.588-1.358-.833-3.62-.833-7.206 0-3.597.245-5.863.834-7.224.287-.662.643-1.08 1.07-1.34.43-.264.984-.396 1.716-.396.738 0 1.292.133 1.722.395.424.26.778.677 1.06 1.34.583 1.36.818 3.627.818 7.225 0 3.588-.235 5.85-.817 7.208-.283.661-.636 1.078-1.061 1.337-.43.262-.984.395-1.722.395Z"
    />
  </Svg>
);
export default Svg0;

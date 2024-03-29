import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { OutlinedNumberSvgProps } from '.';

const Svg2 = ({ size, ...props }: OutlinedNumberSvgProps & SvgProps) => (
  <Svg
    width={size === 'small' ? 25 : 40}
    height={size === 'small' ? 33 : 50}
    viewBox="0 0 25 33"
    fill="none"
    {...props}>
    <Path
      stroke="#F3F3F3"
      d="M21.66 25.08v6.42H.78v-5.92c0-2.578 1.121-4.523 2.74-6.134 1.51-1.503 3.481-2.742 5.406-3.95l.347-.219.015-.01c1.29-.816 2.393-1.513 3.187-2.363.772-.828 1.245-1.794 1.245-3.164 0-1.062-.23-1.725-.627-2.13-.396-.403-1.056-.65-2.153-.65-1.088 0-1.793.242-2.29.787-.522.571-.897 1.56-1.093 3.25l-.057.492-.492-.052-5.9-.62-.422-.044-.025-.423c-.177-2.942.645-5.347 2.436-7.01C4.88 1.69 7.544.84 10.92.84c2.94 0 5.506.62 7.347 2.053C20.13 4.34 21.18 6.564 21.18 9.6c0 6.338-4.3 9.05-8.124 11.463l-.568.359L12.22 21q-.516.329-.97.611c-2.163 1.357-3.286 2.061-3.683 3.469zm0 0H8.09z"
    />
  </Svg>
);
export default Svg2;

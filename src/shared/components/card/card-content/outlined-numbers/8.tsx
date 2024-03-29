import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { OutlinedNumberSvgProps } from '.';

const Svg8 = ({ size, ...props }: OutlinedNumberSvgProps & SvgProps) => (
  <Svg
    width={size === 'small' ? 25 : 40}
    height={size === 'small' ? 33 : 50}
    viewBox="0 0 25 33"
    fill="none"
    {...props}>
    <Path
      stroke="#F3F3F3"
      d="M22.62 8.78c0-2.407-.965-4.415-2.758-5.81C18.083 1.587 15.532.84 12.4.84c-2.711 0-5.258.582-7.142 1.89C3.35 4.052 2.16 6.096 2.16 8.9c0 3.267 1.526 5.528 3.57 7.191-2.482 1.456-4.67 3.765-4.67 7.709 0 2.874 1.21 4.951 3.215 6.288 1.976 1.319 4.683 1.892 7.665 1.892 3.142 0 6.065-.524 8.219-1.863 2.189-1.36 3.541-3.537 3.541-6.697 0-2.236-.649-3.962-1.685-5.34-.852-1.134-1.954-2.015-3.13-2.753 1.986-1.252 3.735-3.245 3.735-6.547ZM12.34 25.7c-1.07 0-2.09-.207-2.828-.685-.708-.458-1.192-1.184-1.192-2.355 0-1.626.913-2.896 2.05-3.852 1.921.919 3.322 1.603 4.261 2.295.958.705 1.35 1.352 1.35 2.197 0 .769-.33 1.34-.92 1.74-.615.416-1.54.66-2.72.66Zm1.218-13.091-.417-.19c-1.036-.472-1.91-.87-2.57-1.34-.756-.54-1.15-1.121-1.15-1.959 0-.718.279-1.23.757-1.579.498-.364 1.256-.581 2.242-.581 1.107 0 1.99.268 2.583.718.578.439.917 1.075.917 1.922 0 .871-.308 1.479-.764 1.95-.425.438-.988.768-1.598 1.059Z"
    />
  </Svg>
);
export default Svg8;

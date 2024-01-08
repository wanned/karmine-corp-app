import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

export const KarmineLogo = ({
  color,
  width,
  height,
}: {
  color: string;
  width: number;
  height: number;
}) => (
  <Svg width={width} height={height} fill="none">
    <G fill={color} clipPath="url(#a)">
      <Path d="M38 25.06c-.008.066-.021.131-.024.197-.015.658-.09 1.31-.214 1.955a8.07 8.07 0 0 1-1.714 3.645c-1.31 1.598-2.99 2.585-5.011 2.985a8.959 8.959 0 0 1-2.488.132c-1.462-.12-2.84-.534-4.163-1.16-1.22-.576-2.342-1.307-3.4-2.142a25.88 25.88 0 0 1-2.635-2.42c-.065-.067-.07-.135-.07-.217V22.91c0-.342 0-.683-.002-1.025 0-.064.015-.105.075-.14.496-.284.99-.572 1.485-.858.01-.007.024-.008.05-.017l.137.151a16.36 16.36 0 0 0 2.079 2.019c.763.608 1.581 1.124 2.497 1.473a6.28 6.28 0 0 0 2.525.414c1.836-.074 3.35-1.267 3.964-2.541.328-.68.456-1.394.397-2.145-.068-.874-.36-1.677-.765-2.443-.416-.785-.94-1.492-1.52-2.162-.027-.032-.054-.067-.091-.11.05-.03.09-.055.132-.078.652-.377 1.304-.754 1.958-1.128a.283.283 0 0 0 .145-.19c.22-.83.445-1.66.67-2.49.011-.042.025-.083.042-.138.028.023.05.036.067.054 1.465 1.514 2.763 3.155 3.787 5.003a16.722 16.722 0 0 1 1.697 4.359c.142.614.252 1.233.309 1.86.024.266.034.53.053.797.004.061.015.121.023.183L38 25.06ZM9.534 0c.056.008.113.019.169.023.282.021.566.04.85.06.028.002.058.01.092.018v5.462c-.05 0-.097.003-.143 0a8.927 8.927 0 0 0-1.21.001c-.783.052-1.546.19-2.262.529-1.138.54-1.805 1.437-2.022 2.676-.11.632-.095 1.263-.008 1.896.156 1.15.515 2.243.956 3.311.565 1.372 1.264 2.677 2.023 3.95a54.695 54.695 0 0 0 2.589 3.916c.06.083.088.164.088.268-.003 1.896-.003 3.79-.003 5.686v.166c-.05-.043-.08-.067-.108-.093a37.854 37.854 0 0 1-6.6-8.526 38.327 38.327 0 0 1-2.773-6.033c-.37-1.041-.675-2.1-.886-3.186a13.895 13.895 0 0 1-.254-2.018c-.012-.261-.039-.524-.03-.785.033-.848.129-1.689.392-2.501.549-1.688 1.633-2.918 3.204-3.728C4.364.698 5.176.44 6.017.268c.656-.133 1.32-.21 1.99-.245.048-.003.096-.015.142-.023h1.385Z" />
      <Path d="m17.23 35.901-.094-.09c-1.792-1.81-3.582-3.62-5.374-5.428a.3.3 0 0 1-.096-.234c.003-9.875.003-19.75.003-29.625v-.14l.028-.012.1.097c1.79 1.796 3.582 3.593 5.375 5.388.064.064.093.13.093.221-.004 2.65-.005 5.3-.008 7.949v.709l.022.014c.005.002.01.002.012 0a.17.17 0 0 0 .024-.009c.005-.001.008-.004.012-.007a.887.887 0 0 0 .035-.02l15.07-8.756.012-.006c.004-.002.008-.004.012-.004l.022.001c-.006.037-.01.076-.02.112-.657 2.462-1.317 4.922-1.974 7.384a.298.298 0 0 1-.154.198c-4.305 2.489-8.61 4.978-12.913 7.468-.195.112-.161.059-.161.274v6.498l.002 5.686.003 2.183v.143l-.03.006Z" />
      <Path d="M12.888.206c.198.042.398.082.595.127 2.163.49 4.242 1.227 6.264 2.13a38.474 38.474 0 0 1 8.044 4.84l.14.114-4.11 2.363c-1.64-1.277-3.499-2.04-5.54-2.401v-.152c0-.475 0-.95.002-1.424a.28.28 0 0 0-.074-.203c-.462-.509-.915-1.027-1.383-1.53-.352-.376-.727-.73-1.085-1.098-.89-.91-1.825-1.773-2.761-2.636L12.87.24c.006-.01.013-.023.018-.035ZM18.286 33.49v-2.747c.008-.002.012-.005.016-.005s.01 0 .012.003c.018.018.038.036.056.056A196.17 196.17 0 0 0 23.186 36c-.173-.032-4.529-2.268-4.9-2.51Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h38v36H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

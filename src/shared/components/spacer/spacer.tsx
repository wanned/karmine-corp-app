import { useMemo } from 'react';
import { View } from 'react-native';

interface SpacerProps {
  size: number;
  direction: 'horizontal' | 'vertical';
}

export const Spacer = ({ size, direction = 'vertical' }: SpacerProps) => {
  const style = useMemo(
    () => ({
      [direction === 'vertical' ? 'height' : 'width']: size,
    }),
    [direction, size]
  );

  return <View style={style} />;
};

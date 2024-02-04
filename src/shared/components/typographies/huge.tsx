import { Text } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Huge = ({ children, color, maxLines }: TypographyProps) => {
  return (
    <Text style={{ height: 52 }}>
      <BaseText
        color={color}
        fontSize={65}
        lineHeight={62}
        fontWeight="ExtraBold"
        maxLines={maxLines}>
        {children}
      </BaseText>
    </Text>
  );
};

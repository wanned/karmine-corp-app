import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Title3 = ({ children, color, maxLines, verticalTrim = false }: TypographyProps) => {
  return (
    <View
      style={{
        height: verticalTrim ? 9 : undefined,
        justifyContent: 'flex-end',
      }}>
      <View
        style={{
          position: 'relative',
          top: verticalTrim ? -5 : undefined,
        }}>
        <BaseText
          color={color}
          fontSize={12}
          fontWeight="Bold"
          lineHeight={verticalTrim ? 20 : undefined}
          maxLines={maxLines}>
          {children}
        </BaseText>
      </View>
    </View>
  );
};

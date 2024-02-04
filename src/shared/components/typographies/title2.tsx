import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Title2 = ({ children, color, maxLines, verticalTrim = false }: TypographyProps) => {
  return (
    <View
      style={{
        height: verticalTrim ? 11 : undefined,
        justifyContent: 'flex-end',
      }}>
      <View style={{ position: 'relative', top: verticalTrim ? 4 : undefined }}>
        <BaseText
          color={color}
          fontSize={16}
          fontWeight="Black"
          lineHeight={verticalTrim ? 20 : undefined}
          maxLines={maxLines}>
          {children}
        </BaseText>
      </View>
    </View>
  );
};

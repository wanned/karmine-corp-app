import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Label = ({ children, color, maxLines, verticalTrim = false }: TypographyProps) => {
  return (
    <View
      style={{
        height: verticalTrim ? 9 : undefined,
        justifyContent: 'flex-end',
      }}>
      <View style={{ position: 'relative', top: verticalTrim ? 3.5 : undefined }}>
        <BaseText
          color={color}
          fontSize={12}
          lineHeight={verticalTrim ? 16 : undefined}
          fontWeight="SemiBold"
          textTransform="uppercase"
          maxLines={maxLines}>
          {children}
        </BaseText>
      </View>
    </View>
  );
};

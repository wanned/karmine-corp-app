import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const VeryBig = ({ children, color, maxLines, verticalTrim = false }: TypographyProps) => {
  return (
    <View
      style={{
        height: verticalTrim ? 32 : undefined,
        justifyContent: 'flex-end',
      }}>
      <View style={{ position: 'relative', top: verticalTrim ? -1 : undefined }}>
        <BaseText
          color={color}
          fontSize={44.5}
          lineHeight={verticalTrim ? 58 : undefined}
          fontWeight="ExtraBold"
          maxLines={maxLines}>
          {children}
        </BaseText>
      </View>
    </View>
  );
};

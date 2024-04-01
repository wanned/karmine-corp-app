import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Huge = ({ children, color, maxLines, verticalTrim = false }: TypographyProps) => {
  return (
    <View
      style={{
        height: verticalTrim ? 45.5 : undefined,
        justifyContent: 'flex-end',
      }}>
      <View style={{ position: 'relative', top: verticalTrim ? -1.5 : undefined }}>
        <BaseText
          color={color}
          fontSize={65}
          lineHeight={verticalTrim ? 84 : undefined}
          fontWeight="ExtraBold"
          maxLines={maxLines}>
          {children}
        </BaseText>
      </View>
    </View>
  );
};

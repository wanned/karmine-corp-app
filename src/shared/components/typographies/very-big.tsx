import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const VeryBig = ({ children, color, verticalTrim = false }: TypographyProps) => {
  return (
    <View
      style={{
        height: verticalTrim ? 32 : undefined,
        justifyContent: 'flex-end',
      }}>
      <View style={{ position: 'relative', top: verticalTrim ? 4 : undefined }}>
        <BaseText
          color={color}
          fontSize={44.5}
          lineHeight={verticalTrim ? 58 : undefined}
          fontWeight="ExtraBold">
          {children}
        </BaseText>
      </View>
    </View>
  );
};

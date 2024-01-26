import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Title1 = ({ children, color, verticalTrim = false }: TypographyProps) => {
  return (
    <View
      style={{
        height: verticalTrim ? 17 : undefined,
        justifyContent: 'flex-end',
      }}>
      <View style={{ position: 'relative', top: verticalTrim ? 6.5 : undefined }}>
        <BaseText
          color={color}
          fontSize={24}
          fontWeight="Black"
          lineHeight={verticalTrim ? 32 : 32}>
          {children}
        </BaseText>
      </View>
    </View>
  );
};

import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Title3 = ({ children, color, verticalTrim = false }: TypographyProps) => {
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
          fontWeight="Bold"
          lineHeight={verticalTrim ? 20 : undefined}>
          {children}
        </BaseText>
      </View>
    </View>
  );
};

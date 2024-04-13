import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Body = ({
  children,
  color,
  maxLines,
  verticalTrim = false,
  textAlign = 'left',
}: TypographyProps) => {
  return (
    <View
      style={{
        height: verticalTrim ? 9 : undefined,
        justifyContent: 'flex-end',
      }}>
      <View style={{ position: 'relative', top: verticalTrim ? -0.5 : undefined }}>
        <BaseText
          color={color}
          fontSize={12}
          fontWeight="SemiBold"
          lineHeight={verticalTrim ? 16 : undefined}
          maxLines={maxLines}
          textAlign={textAlign}>
          {['\u200B', ...(Array.isArray(children) ? children : [children])]}
        </BaseText>
      </View>
    </View>
  );
};

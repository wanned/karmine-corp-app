import { View } from 'react-native';

import { BaseText } from './base-text';
import { TypographyProps } from './typography';

export const Body = ({ children, color, maxLines, verticalTrim = false }: TypographyProps) => {
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
          fontWeight="SemiBold"
          lineHeight={verticalTrim ? 16 : undefined}
          maxLines={maxLines}>
          {['\u200B', ...(Array.isArray(children) ? children : [children])]}
        </BaseText>
        {/* usage of \u200B is a hack to make sure that even a "only number" string will have the same height as a string with letters */}
      </View>
    </View>
  );
};

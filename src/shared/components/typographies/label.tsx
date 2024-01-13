import { Text } from 'react-native';

import { BaseText } from './base-text';

interface LabelProps {
  children: string | string[];
  color?: string;
}

export const Label = ({ children, color }: LabelProps) => {
  const lineHeight = 16;

  return (
    <Text style={{ height: lineHeight * 0.6 }}>
      <BaseText
        color={color}
        fontSize={12}
        lineHeight={lineHeight}
        fontWeight="SemiBold"
        textTransform="uppercase">
        {children}
      </BaseText>
    </Text>
  );
};

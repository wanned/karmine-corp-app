import { Text } from 'react-native';

import { BaseText } from './base-text';

interface BodyProps {
  children: string | string[];
  color?: string;
}

export const VeryBig = ({ children, color }: BodyProps) => {
  return (
    <Text style={{ height: 32 }}>
      <BaseText color={color} fontSize={44.5} lineHeight={41} fontWeight="ExtraBold">
        {children}
      </BaseText>
    </Text>
  );
};

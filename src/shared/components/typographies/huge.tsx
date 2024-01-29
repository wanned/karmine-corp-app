import { Text } from 'react-native';

import { BaseText } from './base-text';

interface BodyProps {
  children: string | string[];
  color?: string;
}

export const Huge = ({ children, color }: BodyProps) => {
  return (
    <Text style={{ height: 52 }}>
      <BaseText color={color} fontSize={65} lineHeight={62} fontWeight="ExtraBold">
        {children}
      </BaseText>
    </Text>
  );
};

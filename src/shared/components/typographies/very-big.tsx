import { BaseText } from './base-text';

interface BodyProps {
  children: string | string[];
  color?: string;
}

export const VeryBig = ({ children, color }: BodyProps) => {
  return (
    <BaseText color={color} fontSize={40} fontWeight="ExtraBold">
      {children}
    </BaseText>
  );
};

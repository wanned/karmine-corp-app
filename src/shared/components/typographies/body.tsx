import { BaseText } from './base-text';

interface BodyProps {
  children: string;
  color?: string;
}

export const Body = ({ children, color }: BodyProps) => {
  return (
    <BaseText color={color} fontSize={12} fontWeight="Medium">
      {children}
    </BaseText>
  );
};
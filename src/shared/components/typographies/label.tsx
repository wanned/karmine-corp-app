import { BaseText } from './base-text';

interface LabelProps {
  children: string | string[];
  color?: string;
}

export const Label = ({ children, color }: LabelProps) => {
  return (
    <BaseText color={color} fontSize={12} fontWeight="SemiBold" textTransform="uppercase">
      {children}
    </BaseText>
  );
};

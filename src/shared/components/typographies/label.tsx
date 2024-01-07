import { BaseText } from './base-text';

interface LabelProps {
  children: string;
  color?: string;
}

export const Label = ({ children, color }: LabelProps) => {
  return (
    <BaseText color={color} fontSize={12} fontWeight="Regular" textTransform="uppercase">
      {children}
    </BaseText>
  );
};

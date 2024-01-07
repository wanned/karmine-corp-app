import { BaseText } from './base-text';

interface Title2Props {
  children: string;
  color?: string;
}

export const Title2 = ({ children, color }: Title2Props) => {
  return (
    <BaseText color={color} fontSize={16} fontWeight="Black">
      {children}
    </BaseText>
  );
};

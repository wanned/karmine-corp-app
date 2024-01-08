import { BaseText } from './base-text';

interface Title1Props {
  children: string | string[];
  color?: string;
}

export const Title1 = ({ children, color }: Title1Props) => {
  return (
    <BaseText color={color} fontSize={24} fontWeight="Black">
      {children}
    </BaseText>
  );
};

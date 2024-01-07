import { BaseText } from './base-text';

interface Title3Props {
  children: string;
  color?: string;
}

export const Title3 = ({ children, color }: Title3Props) => {
  return (
    <BaseText color={color} fontSize={12} fontWeight="Bold">
      {children}
    </BaseText>
  );
};

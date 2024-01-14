import { useMemo } from 'react';
import { Text } from 'react-native';

import { useStyles } from '~/shared/hooks/use-styles';
import { useTheme } from '~/shared/hooks/use-theme';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

const FontWeights = ['Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black'] as const;
type FontWeight = (typeof FontWeights)[number];

const separateTextByNumber = (text: string) => {
  const separatedText: {
    type: 'text' | 'number';
    value: string;
  }[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isNumber = !isNaN(parseInt(char, 10));

    const lastItem = separatedText[separatedText.length - 1];

    if (lastItem?.type === 'number' && isNumber) {
      lastItem.value += char;
    } else if (lastItem?.type === 'text' && !isNumber) {
      lastItem.value += char;
    } else {
      separatedText.push({
        type: isNumber ? 'number' : 'text',
        value: char,
      });
    }
  }

  return separatedText;
};

interface TextProps {
  children: string | string[];
  fontWeight?: FontWeight;
  fontSize?: number;
  color?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
}

export const BaseText = ({ children, fontWeight, fontSize, color, textTransform }: TextProps) => {
  const separatedText = useMemo(
    () => separateTextByNumber(Array.isArray(children) ? children.join('') : children),
    [children]
  );

  const styles = useStyles(getStyles);
  const theme = useTheme();

  const defaultFontWeight: FontWeight = fontWeight ?? 'Regular';
  const numberFontWeight: FontWeight =
    FontWeights[FontWeights.indexOf(defaultFontWeight) - 2] ?? 'ExtraLight';

  const defaultFontStyle = {
    fontFamily: `${styles.default.fontFamily}-${defaultFontWeight}`,
    fontSize,
    color: color ?? theme.colors.foreground,
    textTransform,
  };
  const numberFontStyle = {
    ...defaultFontStyle,
    fontFamily: `${styles.number.fontFamily}-${numberFontWeight}`,
  };

  return (
    <Text>
      {separatedText.map(({ type, value }, index) => {
        if (type === 'number') {
          return (
            <Text key={index} style={numberFontStyle}>
              {value}
            </Text>
          );
        }

        return (
          <Text key={index} style={defaultFontStyle}>
            {value}
          </Text>
        );
      })}
    </Text>
  );
};

const getStyles = createStylesheet((theme) => ({
  default: {
    fontFamily: theme.fonts.default,
  },
  number: {
    fontFamily: theme.fonts.number,
  },
}));

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
  lineHeight?: number;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
  maxLines?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export const BaseText = ({
  children,
  fontWeight,
  fontSize,
  color,
  lineHeight,
  textTransform,
  maxLines,
  textAlign,
}: TextProps) => {
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
    lineHeight,
    textAlign,
    // NOTE: This is a hack to fix the issue with the font being cut off at the top.
    // See: https://github.com/facebook/react-native/issues/29507
    ...(lineHeight &&
      fontSize && {
        marginTop: fontSize - lineHeight,
        position: 'relative' as const,
        top: lineHeight - fontSize,
      }),
  };
  const numberFontStyle = {
    ...defaultFontStyle,
    fontFamily: `${styles.number.fontFamily}-${numberFontWeight}`,
    fontSize: fontSize ? fontSize * 0.95 : undefined,
  };

  return (
    <Text style={defaultFontStyle} numberOfLines={maxLines} ellipsizeMode="tail">
      <Text style={defaultFontStyle}>{'\u200B'}</Text>
      {/* usage of \u200B (empty character) is a hack to make sure that even a "only number" string will have the same height as a string with letters */}

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

import React from 'react';
import { Pressable, View } from 'react-native';

import { Typographies } from '../../typographies';

import { useStyles } from '~/shared/hooks/use-styles';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface MediaCardContentProps {
  title: string;
  date: string;
  likes: number;
  views: number;
  onPress?: () => void;
}

export const MediaCardContent = ({ title, date, likes, views, onPress }: MediaCardContentProps) => {
  const styles = useStyles(getStyles);
  const translate = useTranslate();

  function formatNumber(num: number) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Typographies.Title1 color={styles.title.color} maxLines={2}>
            {title}
          </Typographies.Title1>
        </View>
        <View style={styles.stats}>
          <Typographies.Label color={styles.date.color} verticalTrim>
            {date}
          </Typographies.Label>
          <Typographies.Body color={styles.views.color} verticalTrim>
            {' '}
            ·{' '}
          </Typographies.Body>
          <Typographies.Body color={styles.views.color} verticalTrim>
            {formatNumber(views)} {translate('home.views')} · {formatNumber(likes)}{' '}
            {translate('home.likes')}
          </Typographies.Body>
        </View>
        <View style={{ flex: 1 }} />
        <Typographies.Body color={styles.plateform.color} verticalTrim>
          youtube.com
        </Typographies.Body>
      </View>
    </Pressable>
  );
};

const getStyles = createStylesheet((theme) => ({
  container: {
    height: '100%',
  },
  titleContainer: {
    width: '80%',
  },
  title: {
    color: theme.colors.foreground,
  },
  date: {
    color: theme.colors.accent,
  },
  views: {
    color: theme.colors.subtleForeground,
  },
  likes: {
    color: theme.colors.subtleForeground,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  plateform: {
    color: theme.colors.subtleForeground,
  },
}));

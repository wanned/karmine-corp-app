import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { LivePill } from '~/shared/components/live-pill/live-pill';
import { Typographies } from '~/shared/components/typographies';
import { useDate } from '~/shared/hooks/use-date';
import { useTranslate } from '~/shared/hooks/use-translate';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

type MatchStatus = 'finished' | 'in-progress' | 'upcoming';

interface MatchScoreProps {
  date: Date;
  children: React.ReactNode;
  status: MatchStatus;
  game: KarmineApi.CompetitionName;
  bo?: number;
}

export const MatchScore = React.memo<MatchScoreProps>(
  ({ date, status, game, bo, children }: MatchScoreProps) => {
    const { formatDate, formatTime } = useDate();

    const styles = getStyles(styleTokens);

    const translate = useTranslate();

    const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate('gameDetailsModal')}>
        <View style={styles.titleHeader}>
          <Typographies.Label color={styles.titleDate.color}>
            {formatDate(date)} · {formatTime(date)}{' '}
          </Typographies.Label>
          <Typographies.Label color={styles.titleGame.color}>
            · {translate(`games.${game}`)}
            {bo !== undefined ? ` · BO${bo}` : ''}
          </Typographies.Label>
          {status === 'in-progress' && (
            <View style={styles.livePillWrapper}>
              <LivePill />
            </View>
          )}
        </View>
        <View>{children}</View>
      </TouchableOpacity>
    );
  }
);

const getStyles = createStylesheet((theme) => ({
  container: {
    marginBottom: 16,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleDate: {
    color: theme.colors.accent,
  },
  titleGame: {
    color: theme.colors.subtleForeground,
  },
  livePillWrapper: {
    marginLeft: 8,
  },
}));

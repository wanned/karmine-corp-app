import React from 'react';
import { View } from 'react-native';

import { LivePill } from '~/shared/components/live-pill/live-pill';
import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/shared/data/core/types';
import { useDate } from '~/shared/hooks/use-date';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

type MatchStatus = 'finished' | 'in-progress' | 'upcoming';

interface MatchScoreProps {
  date: Date;
  children: React.ReactNode;
  status: MatchStatus;
  game: CoreData.CompetitionName;
  bo?: number;
}

export const MatchScore = React.memo<MatchScoreProps>(
  ({ date, status, game, bo, children }: MatchScoreProps) => {
    const { formatDate, formatTime } = useDate();

    const styles = getStyles(styleTokens);

    const translate = useTranslate();

    return (
      <View style={styles.container}>
        <View style={styles.titleHeader}>
          <Typographies.Label color={styles.titleDate.color} verticalTrim>
            {formatDate(date)} · {formatTime(date)}{' '}
          </Typographies.Label>
          <Typographies.Label color={styles.titleGame.color} verticalTrim>
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
      </View>
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

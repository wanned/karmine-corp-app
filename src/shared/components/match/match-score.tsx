import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { LivePill } from '~/shared/components/live-pill/live-pill';
import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/shared/data/core/types';
import { useDate } from '~/shared/hooks/use-date';
import { useNavigation } from '~/shared/hooks/use-navigation';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';
import { isSameDay } from 'date-fns';
import { dayUtils } from '~/shared/utils/days';

interface MatchScoreProps {
  children: React.ReactNode;
  match: CoreData.Match;
}

export const MatchScore = React.memo<MatchScoreProps>(
  ({ match, children }: MatchScoreProps) => {
    const { formatDate, formatTime } = useDate();
    const today = dayUtils.today;
    const yesterday = dayUtils.yesterday;
    const tomorrow = dayUtils.tomorrow;

    const styles = getStyles(styleTokens);

    const translate = useTranslate();

    const navigation = useNavigation();

    const formattedDate = formatDate(match.date);
    const formattedTime = formatTime(match.date);

    let dateLabel = formattedDate;

    const isToday = isSameDay(match.date, today);
    const isTomorrow = isSameDay(match.date, tomorrow);
    const isYesterday = isSameDay(match.date, yesterday);

    if (isToday) {
      dateLabel = translate('home.today');
    } else if (isTomorrow) {
      dateLabel = translate('home.tomorrow');
    } else if (isYesterday) {
      dateLabel = translate('home.yesterday');
    }

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate('gameDetailsModal', { match })}>
        <View style={styles.titleHeader}>
          <Typographies.Label color={styles.titleDate.color} verticalTrim>
            {dateLabel} · {formattedTime}
          </Typographies.Label>
          <Typographies.Label color={styles.titleGame.color} verticalTrim>
            · {translate(`games.${match.matchDetails.competitionName}`)}
            {match.matchDetails.bo !== undefined ? ` · BO${match.matchDetails.bo}` : ''}
          </Typographies.Label>
          {match.status === 'live' && (
            <View style={styles.livePillWrapper}>
              <LivePill />
            </View>
          )}
        </View>
        <View>{children}</View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => prevProps.match.id === nextProps.match.id
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

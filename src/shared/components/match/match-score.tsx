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

interface MatchScoreProps {
  children: React.ReactNode;
  match: CoreData.Match;
}

export const MatchScore = React.memo<MatchScoreProps>(
  ({ match, children }: MatchScoreProps) => {
    const { formatDate, formatTime } = useDate();
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const styles = getStyles(styleTokens);

    const translate = useTranslate();

    const navigation = useNavigation();

    const todayDay = today.getDate();
    const todayYear = today.getFullYear();
    const todayMonthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      today
    );

    const tomorrowDay = tomorrow.getDate();
    const tomorrowYear = tomorrow.getFullYear();
    const tomorrowMonthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      tomorrow
    );

    const yesterdayDay = yesterday.getDate();
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      yesterday
    );

    const tomorrowString = `${tomorrowDay} ${tomorrowMonthAbbreviation} ${tomorrowYear}`;
    const todayString = `${todayDay} ${todayMonthAbbreviation} ${todayYear}`;
    const yesterdayString = `${yesterdayDay} ${yesterdayMonthAbbreviation} ${yesterdayYear}`;

    const formattedDate = formatDate(match.date);
    const formattedTime = formatTime(match.date);

    let dateLabel = formattedDate;

    if (formattedDate === todayString) {
      dateLabel = translate('home.today');
    } else if (formattedDate === tomorrowString) {
      dateLabel = translate('home.tomorrow');
    } else if (formattedDate === yesterdayString) {
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

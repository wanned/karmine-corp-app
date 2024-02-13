import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Iconify } from 'react-native-iconify';

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

    const styles = getStyles(styleTokens);

    const translate = useTranslate();

    const navigation = useNavigation();

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate('gameDetailsModal', { match })}>
        <View style={styles.titleHeader}>
          <Typographies.Label color={styles.titleDate.color} verticalTrim>
            {formatDate(match.date)} · {formatTime(match.date)}{' '}
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
        <View style={styles.childrenContainer}>
          <View style={styles.children}>{children}</View>
          <Iconify icon="solar:alt-arrow-right-outline" color={styles.icon.color} size={16} />
        </View>
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
  children: {
    flex: 1,
  },
  childrenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    color: theme.colors.subtleForeground,
  },
}));

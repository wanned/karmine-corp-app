import { format } from 'date-fns';
import { View } from 'react-native';

import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { LivePill } from '~/shared/components/live-pill/live-pill';
import { Typographies } from '~/shared/components/typographies';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

type MatchStatus = 'finished' | 'in-progress' | 'upcoming';

interface MatchScoreProps {
  date: Date;
  children: React.ReactNode;
  status: MatchStatus;
  game: KarmineApi.CompetitionName;
  bo: number;
}

export const MatchScore = ({ date, status, game, bo, children }: MatchScoreProps) => {
  const styles = getStyles(styleTokens);

  return (
    <View style={styles.container}>
      <View style={styles.titleHeader}>
        <Typographies.Label color={styles.titleDate.color}>
          {format(date, "dd MMM yyyy · HH'H' ")}
        </Typographies.Label>
        <Typographies.Label color={styles.titleGame.color}>
          · {game} · BO{bo?.toString()}
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
};

const getStyles = createStylesheet((theme) => ({
  container: {
    marginBottom: 16,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
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

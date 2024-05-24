import { isSameDay } from 'date-fns';
import React from 'react';
import { View } from 'react-native';

import { LivePill } from '../../live-pill/live-pill';
import { Typographies } from '../../typographies';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';
import { useDate } from '~/shared/hooks/use-date';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';
import { dayUtils } from '~/shared/utils/days';

interface MatchLabelProps {
  date?: CoreData.Match['date'];
  competitionName: CoreData.CompetitionName;
  status: CoreData.Match['status'];
  bo: CoreData.Match['matchDetails']['bo'];
  subtleColor?: boolean;
  showLivePill?: boolean;
}

export const MatchLabel = React.memo(
  ({
    date,
    competitionName,
    bo,
    status,
    subtleColor = true,
    showLivePill = true,
  }: MatchLabelProps) => {
    const styles = getStyles(styleTokens);

    return (
      <View style={styles.header}>
        {date !== undefined && <MatchDate key="date" date={date} />}
        <MatchGame
          key="game"
          competitionName={competitionName}
          first={date === undefined}
          subtleColor={subtleColor}
        />
        <MatchBo key="bo" bo={bo} subtleColor={subtleColor} />

        {status === 'live' && showLivePill && (
          <View style={styles.livePillWrapper}>
            <LivePill />
          </View>
        )}
      </View>
    );
  }
);

interface MatchGameProps {
  competitionName: CoreData.CompetitionName;
  first?: boolean;
  subtleColor: boolean;
}

const MatchGame = React.memo(({ competitionName, first, subtleColor }: MatchGameProps) => {
  const styles = getStyles(styleTokens);
  const translate = useTranslate();

  return (
    <>
      {!first && (
        <Typographies.Label color={styles[subtleColor ? 'subtleGame' : 'game'].color} verticalTrim>
          {' · '}
        </Typographies.Label>
      )}
      <Typographies.Label color={styles[subtleColor ? 'subtleGame' : 'game'].color} verticalTrim>
        {translate(`games.${competitionName}`)}
      </Typographies.Label>
    </>
  );
});

interface MatchBoProps {
  bo: CoreData.Match['matchDetails']['bo'];
  subtleColor: boolean;
}

export const MatchBo = React.memo(({ bo, subtleColor }: MatchBoProps) => {
  const styles = getStyles(styleTokens);

  if (bo === undefined) {
    return null;
  }

  return (
    <>
      <Typographies.Label color={styles[subtleColor ? 'subtleGame' : 'game'].color} verticalTrim>
        {' · '}
      </Typographies.Label>
      <Typographies.Label color={styles[subtleColor ? 'subtleGame' : 'game'].color} verticalTrim>
        BO{bo.toString()}
      </Typographies.Label>
    </>
  );
});

interface MatchDateProps {
  date: CoreData.Match['date'];
}

const MatchDate = React.memo(
  ({ date }: MatchDateProps) => {
    const styles = getStyles(styleTokens);
    const translate = useTranslate();

    const { formatDate, formatTime } = useDate();

    const formattedDate =
      isSameDay(date, dayUtils.today) ? translate('home.today')
      : isSameDay(date, dayUtils.yesterday) ? translate('home.yesterday')
      : isSameDay(date, dayUtils.tomorrow) ? translate('home.tomorrow')
      : formatDate(date);

    const formattedTime = formatTime(date, "HH'h'mm");

    return (
      <Typographies.Label color={styles.date.color} verticalTrim>
        {formattedDate} · {formattedTime}
      </Typographies.Label>
    );
  },
  (prevProps, nextProps) => prevProps.date === nextProps.date
);

const getStyles = createStylesheet((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: theme.colors.accent,
  },
  game: {
    color: theme.colors.foreground,
  },
  subtleGame: {
    color: theme.colors.subtleForeground,
  },
  livePillWrapper: {
    marginLeft: 8,
  },
}));

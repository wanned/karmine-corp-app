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
  date: CoreData.Match['date'];
  competitionName: CoreData.CompetitionName;
  status: CoreData.Match['status'];
  bo: CoreData.Match['matchDetails']['bo'];
}

export const MatchLabel = React.memo(({ date, competitionName, bo, status }: MatchLabelProps) => {
  const styles = getStyles(styleTokens);

  return (
    <View style={styles.header}>
      <MatchDate key="date" date={date} />
      <MatchGame key="game" competitionName={competitionName} />
      <MatchBo key="bo" bo={bo} />

      {status === 'live' && (
        <View style={styles.livePillWrapper}>
          <LivePill />
        </View>
      )}
    </View>
  );
});

interface MatchGameProps {
  competitionName: CoreData.CompetitionName;
}

const MatchGame = React.memo(({ competitionName }: MatchGameProps) => {
  const styles = getStyles(styleTokens);
  const translate = useTranslate();

  return (
    <>
      <Typographies.Label color={styles.game.color} verticalTrim>
        {' · '}
      </Typographies.Label>
      <Typographies.Label color={styles.game.color} verticalTrim>
        {translate(`games.${competitionName}`)}
      </Typographies.Label>
    </>
  );
});

interface MatchBoProps {
  bo: CoreData.Match['matchDetails']['bo'];
}

export const MatchBo = React.memo(({ bo }: MatchBoProps) => {
  const styles = getStyles(styleTokens);

  if (bo === undefined) {
    return null;
  }

  return (
    <>
      <Typographies.Label color={styles.game.color} verticalTrim>
        {' · '}
      </Typographies.Label>
      <Typographies.Label color={styles.game.color} verticalTrim>
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

    const formattedTime = formatTime(date);

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
    color: theme.colors.subtleForeground,
  },
  livePillWrapper: {
    marginLeft: 8,
  },
}));
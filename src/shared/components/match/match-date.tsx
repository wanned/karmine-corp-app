import { isSameDay } from 'date-fns';
import React from 'react';

import { Label } from '../typographies/label';

import { CoreData } from '~/shared/data/core/types';
import { useDate } from '~/shared/hooks/use-date';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';
import { dayUtils } from '~/shared/utils/days';

interface MatchDateProps {
  date: CoreData.Match['date'];
}

export const MatchDate = React.memo<MatchDateProps>(
  ({ date }: MatchDateProps) => {
    const styles = getStyles(styleTokens);
    const translate = useTranslate();

    const { formatDate, formatTime } = useDate();

    const formattedDate = formatDate(date);
    const formattedTime = formatTime(date, "HH'H'mm");

    const { yesterday, today, tomorrow } = dayUtils;

    const isToday = isSameDay(date, today);
    const isTomorrow = isSameDay(date, tomorrow);
    const isYesterday = isSameDay(date, yesterday);

    let dateLabel = formattedDate;

    if (isToday) {
      dateLabel = translate('home.today');
    } else if (isTomorrow) {
      dateLabel = translate('home.tomorrow');
    } else if (isYesterday) {
      dateLabel = translate('home.yesterday');
    }

    return (
      <Label color={styles.date.color} verticalTrim>
        {dateLabel} · {formattedTime}
      </Label>
    );
  },
  (prevProps, nextProps) => prevProps.date === nextProps.date
);

const getStyles = createStylesheet((theme) => ({
  date: {
    color: theme.colors.accent,
  },
}));

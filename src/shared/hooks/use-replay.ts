import * as changeCase from 'change-case';
import * as datefns from 'date-fns';
import { useCallback, useState } from 'react';
import { Linking } from 'react-native';

import { searchYoutube } from '../utils/youtube-search';

import { CoreData } from '~/lib/karmine-corp-api/application/types/core-data';

interface SearchReplayProps {
  date: Date;
  teams: CoreData.Match['teams'];
  gameNumber?: number;
  game: CoreData.CompetitionName;
}

export const useReplay = () => {
  const [replayVideo, setReplayVideo] = useState<
    Awaited<ReturnType<typeof searchYoutube>>[number] | undefined
  >();

  const searchReplay = useCallback(({ date, teams, gameNumber, game }: SearchReplayProps) => {
    const opponentName = teams.find(
      (team) =>
        team !== null &&
        !team.name.toLowerCase().includes('karmine') &&
        !team.name.toLowerCase().includes('kc')
    )?.name;

    const dateAfter = datefns.addDays(date, -1);
    const dateBefore = datefns.addDays(date, 1);
    const searchQuery = String.prototype.concat(
      `('karmine corp' OR kc OR kcb) `,
      opponentName !== undefined ? `vs ${opponentName} ` : '',
      gameNumber !== undefined ? `'[Game ${gameNumber}]' ` : '',
      `${changeCase.noCase(game)} `,
      'karminecorp replay, ',
      `after:${datefns.format(dateAfter, 'yyyy-MM-dd')} `,
      `before:${datefns.format(dateBefore, 'yyyy-MM-dd')}`
    );

    searchYoutube(searchQuery).then((videos) => {
      setReplayVideo(videos.filter(Boolean)[0]);
    });
  }, []);

  const openReplayVideo = useCallback(() => {
    if (replayVideo !== undefined) {
      Linking.openURL(replayVideo.url);
    }
  }, [replayVideo]);

  return { replayVideo, openReplayVideo, searchReplay };
};

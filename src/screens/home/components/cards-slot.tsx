import React, { useMemo } from 'react';
import { Linking, View } from 'react-native';

import { useGameBackgroundImage } from '../hooks/use-game-background-image';

import { GameCardContent } from '~/shared/components/card/card-content/game-card-content';
import { MediaCardContent } from '~/shared/components/card/card-content/media-card-content';
import { CardWrapper } from '~/shared/components/card-wrapper/card-wrapper';
import { useLiveMatches } from '~/shared/hooks/data/use-live-match';
import { useYoutubeVideos } from '~/shared/hooks/data/use-youtube-videos';

type CardsData = Parameters<typeof CardWrapper>[0]['cardsData'];

export const CardsSlot = React.memo(({ style }: { style?: View['props']['style'] }) => {
  const lastYoutubeVideoCardData = useLastYoutubeVideoCardData();
  const liveMatchesCardData = useLiveMatchesCardData();

  return (
    <View style={style}>
      <CardWrapper height={160} cardsData={[...lastYoutubeVideoCardData, ...liveMatchesCardData]} />
    </View>
  );
});

const useLastYoutubeVideo = () => {
  const { data: videos } = useYoutubeVideos();

  return useMemo(() => {
    if (videos === undefined) return undefined;
    return videos.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )[0];
  }, [videos]);
};

const useLastYoutubeVideoCardData = (): CardsData => {
  const lastVideo = useLastYoutubeVideo();

  return useMemo(
    () => [
      lastVideo && {
        id: lastVideo.id,
        content: (
          <MediaCardContent
            title={lastVideo.title}
            date={new Date(lastVideo.publishedAt).toLocaleDateString()}
            likes={lastVideo.likes}
            views={lastVideo.views}
            onPress={() => Linking.openURL(lastVideo.url)}
          />
        ),
        image: { uri: lastVideo.thumbnailUrl },
      },
    ],
    [lastVideo]
  );
};

const useLiveMatchesCardData = (): CardsData => {
  const liveMatches = useLiveMatches();
  const gameImageAssets = useGameBackgroundImage();

  return useMemo(
    () =>
      liveMatches.map<CardsData[number]>((liveMatch) => ({
        id: liveMatch.id,
        image: gameImageAssets?.[liveMatch.matchDetails.competitionName] ?? { uri: '' },
        content: (
          <GameCardContent
            showLivePill
            teamLeft={{
              logo: liveMatch.teams[0].logoUrl,
              name: liveMatch.teams[0].name,
              ...(liveMatch.teams[0].score !== undefined && {
                score: liveMatch.teams[0].score.score,
                isWinner: liveMatch.teams[0].score.isWinner,
              }),
            }}
            teamRight={
              liveMatch.teams[1] === null ?
                undefined
              : {
                  logo: liveMatch.teams[1].logoUrl,
                  name: liveMatch.teams[1].name,
                  ...(liveMatch.teams[1].score !== undefined && {
                    score: liveMatch.teams[1].score.score,
                    isWinner: liveMatch.teams[1].score.isWinner,
                  }),
                }
            }
          />
        ),
      })),
    [liveMatches]
  );
};

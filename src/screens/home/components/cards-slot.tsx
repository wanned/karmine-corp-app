import React, { useMemo } from 'react';
import { Linking, View } from 'react-native';

import { MediaCardContent } from '~/shared/components/card/card-content/media-card-content';
import { CardWrapper } from '~/shared/components/card-wrapper/card-wrapper';
import { useYoutubeVideos } from '~/shared/hooks/data/use-youtube-videos';

export const CardsSlot = React.memo(({ style }: { style?: View['props']['style'] }) => {
  const lastYoutubeVideoCardData = useLastYoutubeVideoCardData();

  return (
    <View style={style}>
      <CardWrapper height={160} cardsData={[lastYoutubeVideoCardData]} />
    </View>
  );
});

const useLastYoutubeVideo = () => {
  const { data: videos } = useYoutubeVideos();

  return useMemo(() => {
    if (videos === undefined) return undefined;
    return videos.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())[0];
  }, [videos]);
};

const useLastYoutubeVideoCardData = () => {
  const lastVideo = useLastYoutubeVideo();

  return useMemo(
    () =>
      lastVideo && {
        id: lastVideo.id,
        content: (
          <MediaCardContent
            title={lastVideo.title}
            date={lastVideo.publishedAt.toLocaleDateString()}
            likes={lastVideo.likes}
            views={lastVideo.views}
            onPress={() => Linking.openURL(lastVideo.url)}
          />
        ),
        image: { uri: lastVideo.thumbnailUrl },
      },
    [lastVideo]
  );
};

import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { Linking, View } from 'react-native';

import { LastResults } from './components/last-results';
import { NextMatches } from './components/next-matches';
import { useGameImageAssets } from './hooks/use-game-image-assets';

import { Buttons } from '~/shared/components/buttons';
import { GameCardContent } from '~/shared/components/card/card-content/game-card-content';
import { MediaCardContent } from '~/shared/components/card/card-content/media-card-content';
import { CardWrapper } from '~/shared/components/card-wrapper/card-wrapper';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

export default function HomeScreen() {
  const gameImageAssets = useGameImageAssets();

  const styles = getStyles(styleTokens);

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const translate = useTranslate();

  return (
    <DefaultLayout>
      <View style={styles.cardWrapperContainer}>
        <CardWrapper
          height={160}
          cardsData={[
            {
              id: '1',
              content: (
                <GameCardContent
                  teamLeft={{
                    logo: 'https://medias.kametotv.fr/karmine/teams_logo/KC.png',
                    name: 'Karmine Corp',
                    score: '2',
                    isWinner: true,
                  }}
                  teamRight={{
                    logo: 'https://medias.kametotv.fr/karmine/teams_logo/Team%20Heretics.png',
                    name: 'Team Heretics',
                    score: '1',
                    isWinner: false,
                  }}
                />
              ),
              image: gameImageAssets?.lol || { uri: '' },
            },
            {
              id: '2',
              content: (
                <GameCardContent
                  teamLeft={{
                    logo: 'https://medias.kametotv.fr/karmine/teams_logo/KC.png',
                    name: 'Karmine Corp',
                    score: '2',
                    isWinner: true,
                  }}
                  teamRight={{
                    logo: 'https://medias.kametotv.fr/karmine/teams_logo/Team%20Heretics.png',
                    name: 'Team Heretics',
                    score: '1',
                    isWinner: false,
                  }}
                />
              ),
              image: gameImageAssets?.rl || { uri: '' },
            },
            {
              id: '3',
              content: (
                <GameCardContent
                  teamLeft={{
                    logo: 'https://medias.kametotv.fr/karmine/teams_logo/KC.png',
                    name: 'Karmine Corp',
                    score: '2',
                    isWinner: true,
                  }}
                  teamRight={{
                    logo: 'https://medias.kametotv.fr/karmine/teams_logo/Team%20Heretics.png',
                    name: 'Team Heretics',
                    score: '1',
                    isWinner: false,
                  }}
                />
              ),
              image: gameImageAssets?.valorant || { uri: '' },
            },
            {
              id: '5',
              content: (
                <MediaCardContent
                  title="Prime présente le maillot LEC 2024"
                  date="03 JANV. 2024"
                  likes={9823}
                  views={98775}
                  onPress={() => {
                    Linking.openURL('https://www.youtube.com/v/-RC1p9HWGaY?version=3');
                  }}
                />
              ),
              image: { uri: 'https://i.ytimg.com/vi/-RC1p9HWGaY/maxresdefault.jpg' },
            },
          ]}
        />
      </View>
      <NextMatches
        max={3}
        viewMoreButton={
          <View style={styles.viewMoreButtonWrapper}>
            <Buttons.Text
              text={translate('home.nextMatchesViewMoreText')}
              onPress={() => navigation.navigate('nextMatchesModal')}
            />
          </View>
        }
      />
      <LastResults
        max={3}
        viewMoreButton={
          <View style={styles.viewMoreButtonWrapper}>
            <Buttons.Text
              text={translate('home.lastResultsViewMoreText')}
              onPress={() => navigation.navigate('lastResultsModal')}
            />
          </View>
        }
      />
    </DefaultLayout>
  );
}

const getStyles = createStylesheet((theme) => ({
  viewMoreButtonWrapper: {
    marginVertical: 16,
    textAlign: 'center',
    alignItems: 'center',
  },
  cardWrapperContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
}));

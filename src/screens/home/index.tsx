import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { LolCardContent } from '~/shared/components/card/card-content/lol-card-content';
import { CardWrapper } from '~/shared/components/card-wrapper/card-wrapper';
import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Section } from '~/shared/components/section/section';
import { TextButton } from '~/shared/components/text-button/TextButton';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

export default function HomeScreen() {
  const styles = getStyles(styleTokens);

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const translate = useTranslate();

  const teamLeft = {
    logo: 'https://medias.kametotv.fr/karmine/teams_logo/KC.png',
    name: 'Karmine Corp',
    score: '1',
    isWinner: true,
  };

  const teamRight = {
    logo: 'https://medias.kametotv.fr/karmine/teams_logo/Team%20Heretics.png',
    name: 'Team Heretics',
    score: '2',
    isWinner: false,
  };

  return (
    <DefaultLayout>
      <View style={styles.cardWrapperContainer}>
        <CardWrapper
          height={160}
          cardData={[
            {
              id: '1',
              content: <LolCardContent teamLeft={teamLeft} teamRight={teamRight} />,
              imagePath: 'https://www.pedagojeux.fr/wp-content/uploads/2019/11/1280x720_LoL.jpg',
            },
            {
              id: '2',
              content: <View />,
              imagePath:
                'https://fastly.picsum.photos/id/312/1280/720.jpg?hmac=DuZFMQOu8A5pIW05E42Ue5H6ozEMqtopekRTElSYtlI',
            },
            {
              id: '3',
              content: <View />,
              imagePath:
                'https://fastly.picsum.photos/id/312/1280/720.jpg?hmac=DuZFMQOu8A5pIW05E42Ue5H6ozEMqtopekRTElSYtlI',
            },
          ]}
        />
      </View>
      <Section title={translate('home.nextMatchesTitle')}>
        {[...Array(3)].map((_, index) => (
          <MatchScore
            key={index}
            date={new Date('2023-09-17T17:00:00')}
            status="upcoming"
            bo={5}
            game={KarmineApi.CompetitionName.LeagueOfLegendsLFL}>
            <MatchTeam
              logo="https://medias.kametotv.fr/karmine/teams_logo/KC.png"
              name="Karmine Corp"
              isWinner
              score="-"
            />
            <MatchTeam
              logo="https://medias.kametotv.fr/karmine/teams_logo/KC.png"
              name="G2"
              isWinner
              score="-"
            />
          </MatchScore>
        ))}
        <View style={styles.viewMoreButtonWrapper}>
          <TextButton
            title={translate('home.nextMatchesViewMoreText')}
            onPress={() => navigation.navigate('calendar')}
          />
        </View>
      </Section>
      <Section title={translate('home.lastResultsTitle')}>
        {[...Array(3)].map((_, index) => (
          <MatchScore
            key={index}
            date={new Date('2023-09-17T17:00:00')}
            status="in-progress"
            bo={5}
            game={KarmineApi.CompetitionName.LeagueOfLegendsLFL}>
            <MatchTeam
              logo="https://medias.kametotv.fr/karmine/teams_logo/KC.png"
              name="Karmine Corp"
              isWinner
              score="-"
            />
            <MatchTeam
              logo="https://medias.kametotv.fr/karmine/teams_logo/KC.png"
              name="G2"
              isWinner
              score="-"
            />
          </MatchScore>
        ))}
        <View style={styles.viewMoreButtonWrapper}>
          <TextButton
            title={translate('home.lastResultsViewMoreText')}
            onPress={() => navigation.navigate('calendar')}
          />
        </View>
      </Section>
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

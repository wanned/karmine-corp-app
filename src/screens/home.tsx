import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { KarmineApi } from '~/shared/apis/karmine/types/KarmineApi';
import { Buttons } from '~/shared/components/buttons';
import { MatchScore } from '~/shared/components/match/match-score';
import { MatchTeam } from '~/shared/components/match/match-team';
import { Section } from '~/shared/components/section/section';
import { useTranslate } from '~/shared/hooks/use-translate';
import { DefaultLayout } from '~/shared/layouts/default-layout';
import { RootStackParamList } from '~/shared/navigation';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

export default function HomeScreen() {
  const styles = getStyles(styleTokens);

  const navigation = useNavigation<NavigationContainerRef<RootStackParamList>>();

  const translate = useTranslate();

  return (
    <DefaultLayout>
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
          <Buttons.Text
            text={translate('home.nextMatchesViewMoreText')}
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
          <Buttons.Text
            text={translate('home.lastResultsViewMoreText')}
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
}));

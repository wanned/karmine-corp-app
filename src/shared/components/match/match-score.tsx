import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { LolGames } from '~/screens/game-details-modal/components/lol-games';
import { LivePill } from '~/shared/components/live-pill/live-pill';
import { Typographies } from '~/shared/components/typographies';
import { CoreData } from '~/shared/data/core/types';
import { useDate } from '~/shared/hooks/use-date';
import { useNavigation } from '~/shared/hooks/use-navigation';
import { useTranslate } from '~/shared/hooks/use-translate';
import { createStylesheet } from '~/shared/styles/create-stylesheet';
import { styleTokens } from '~/shared/styles/tokens';

type MatchStatus = 'finished' | 'in-progress' | 'upcoming';

interface MatchScoreProps {
  date: Date;
  children: React.ReactNode;
  status: MatchStatus;
  game: CoreData.CompetitionName;
  bo?: number;
}

export const MatchScore = React.memo<MatchScoreProps>(
  ({ date, status, game, bo, children }: MatchScoreProps) => {
    const { formatDate, formatTime } = useDate();

    const styles = getStyles(styleTokens);

    const translate = useTranslate();

    const navigation = useNavigation();

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          navigation.navigate('gameDetailsModal', {
            gamesComponent: LolGames,
            match: {
              date: new Date('2023-12-26T17:00:00.000Z'),
              streamLink: 'https://www.twitch.tv/karminecorp',
              matchDetails: {
                bo: 1,
                game: CoreData.CompetitionName.LeagueOfLegendsLEC,
                games: [
                  {
                    duration: 1500,
                    score: {
                      blue: 0,
                      red: 1,
                    },
                    draft: {
                      blue: {
                        picks: [
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                        ],
                      },
                      red: {
                        picks: [
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                        ],
                      },
                    },
                  },
                  {
                    duration: 2500,
                    score: {
                      blue: 2,
                      red: 1,
                    },
                    draft: {
                      blue: {
                        picks: [
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                        ],
                      },
                      red: {
                        picks: [
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                          {
                            champion: {
                              name: 'Aatrox',
                              imageUrl:
                                'https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Aatrox.png',
                            },
                            player: 'Saken',
                          },
                        ],
                      },
                    },
                  },
                ],
              },
              teams: [
                {
                  players: [
                    {
                      name: 'Saken',
                      picture: undefined,
                      position: 'left',
                      role: 'adc',
                    },
                    {
                      name: 'Cabochard',
                      picture: 'https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png',
                      position: 'left',
                      role: 'jungle',
                    },
                    {
                      name: 'Bo',
                      picture: 'https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png',
                      position: 'left',
                      role: 'mid',
                    },
                  ],
                  logoUrl: 'https://medias.kametotv.fr/karmine/teams_logo/KC.png',
                  name: 'Karmine Corp',
                  score: {
                    score: 2,
                    isWinner: true,
                  },
                },
                {
                  players: [
                    {
                      name: 'Upset',
                      picture: 'https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png',
                      position: 'right',
                      role: 'adc',
                    },
                    {
                      name: 'Targamas',
                      picture: 'https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png',
                      position: 'right',
                      role: 'adc',
                    },
                    {
                      name: 'Vatira',
                      picture: 'https://medias.kametotv.fr/karmine/players/uploaded/TARGALEC.png',
                      position: 'right',
                      role: 'adc',
                    },
                  ],
                  logoUrl: 'https://medias.kametotv.fr/karmine/teams_logo/Team%20Heretics.png',
                  name: 'Team Herectics',
                  score: {
                    score: 1,
                    isWinner: false,
                  },
                },
              ],
            },
          })
        }>
        <View style={styles.titleHeader}>
          <Typographies.Label color={styles.titleDate.color} verticalTrim>
            {formatDate(date)} · {formatTime(date)}{' '}
          </Typographies.Label>
          <Typographies.Label color={styles.titleGame.color} verticalTrim>
            · {translate(`games.${game}`)}
            {bo !== undefined ? ` · BO${bo}` : ''}
          </Typographies.Label>
          {status === 'in-progress' && (
            <View style={styles.livePillWrapper}>
              <LivePill />
            </View>
          )}
        </View>
        <View>{children}</View>
      </TouchableOpacity>
    );
  }
);

const getStyles = createStylesheet((theme) => ({
  container: {
    marginBottom: 16,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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

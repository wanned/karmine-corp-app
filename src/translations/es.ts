import { Translations } from './Translations';

export const esTranslations: Translations['es'] = {
  onboarding: {
    pages: {
      0: {
        title: '¡Bienvenido a Karmine Plus!',
        description:
          'Karmine Plus es una aplicación no oficial. Sigue los partidos de Karmine Corp y más.',
      },
      1: {
        title: 'Notificaciones',
        description: 'Elige los juegos que recibirás notificaciones.',
      },
      2: {
        title: 'Spoiler',
        description:
          '¿No quieres saber los resultados? Apaga los spoilers.\nPara revelarlos, simplemente mentenga presionando en un partido.',
      },
      3: {
        title: '¡Vamos!',
        description: 'Descubre los últimos resultados y los próximos partidos.',
      },
    },
    startButton: 'Comenzar',
    nextButton: 'Siguiente',
  },
  home: {
    screenName: 'Inicio',
    nextMatchesTitle: 'Los próximos partidos',
    nextMatchesViewMoreText: 'Ver todos los partidos',
    lastResultsTitle: 'Los últimos resultados',
    lastResultsViewMoreText: 'Ver todos los resultados',
    views: 'vistas',
    likes: 'likes',
    noMatches: 'No hay partidos',
    tomorrow: 'Mañana',
    today: 'Hoy',
    yesterday: 'Ayer',
  },
  calendar: {
    screenName: 'Calendario',
    noMatchesToday: 'No hay partido hoy',
  },
  teams: {
    screenName: 'Equipos',
    leaderboardTitle: 'Classificación',
    playersTitle: 'Miembros',
    winAbbr: 'V',
    lossAbbr: 'D',
    pointsAbbr: 'pts',
  },
  settings: {
    screenName: 'Configuración',
    version: 'Versión',
    notAffiliated: 'No afiliado a Karmine Corp',
    notifications: {
      title: 'Notificaciones',
      description: 'Elija los juegos que recibirá notificaciones.',
    },
    spoiler: {
      title: 'Spoiler',
      showResults: 'Mostrar resultados',
    },
    language: {
      title: 'Idioma',
      description: 'Elija el idioma de la aplicación.',
      languages: {
        en: 'English',
        es: 'Español',
        fr: 'Français',
      },
    },
    other: {
      title: 'Otros',
      buttonTitles: {
        bugReport: 'Reportar un error',
        karmineCorpWebsite: 'Ir a karminecorp.fr',
        karmineCorpTwitter: 'Visitar el X de Karmine Corp',
        credits: 'Créditos',
      },
    },
  },
  credits: {
    screenName: 'Créditos',
    contributors: {
      title: 'Contribuidores',
      description: 'Gracias a todas las personas que han contribuido a la aplicación.',
    },
    apis: {
      title: 'APIs',
      description: 'Los datos de la aplicación proceden de las siguientes fuentes.',
    },
    libraries: {
      title: 'Librerías',
      description: 'La aplicación utiliza las siguientes librerías.',
    },
  },
  games: {
    LeagueOfLegendsLFL: 'LFL',
    LeagueOfLegendsLEC: 'LEC',
    RocketLeague: 'Rocket League',
    SuperSmashBrosUltimate: 'Smash Bros',
    TFT: 'TFT',
    TeamfightTacticsGSC: 'TFT',
    TrackMania: 'Trackmania',
    ValorantVCT: 'Valorant',
    ValorantVCT_GC: 'Valorant Femenino',
    Fortnite: 'Fortnite',
  },
  gameDetails: {
    gamesTitle: 'Games',
    playersTitle: 'Jugadores',
    gamePrefix: 'Game',
    watchReplayText: 'Ver el replay',
    goalsText: 'Goles',
    stopsText: 'Paradas',
    totalText: 'Total de puntos',
    cancelNotificationButtonText: 'Cancelar la notificación',
    watchStreamButtonText: 'Ver el stream',
    shareStreamButtonText: 'Compartir el stream',
    noGameDetails: 'No hay detalles del partido',
  },
  notifications: {
    matchStarting: [
      ({ game, karmineName, opponentName }) => {
        return {
          title:
            opponentName !== undefined ?
              `${game} : ${karmineName} vs ${opponentName}`
            : `${game} : ${karmineName}`,
          body: 'El partido comenzará pronto',
        };
      },
    ],
    matchScoreUpdated: [
      ({
        game,
        karmineName,
        karmineScore,
        oldKarmineScore,
        opponentName,
        opponentScore,
        oldOpponentScore,
        scoreType,
      }) => {
        let title = '';
        let scoreTitle = `(${scoreType === 'top' ? 'Top ' : ''}${karmineScore}`;
        if (opponentScore !== undefined)
          scoreTitle += ` - ${scoreType === 'top' ? 'Top ' : ''}${opponentScore}`;
        scoreTitle += ')';

        title = `${scoreTitle} ${game} : ${karmineName}${
          opponentName ? ` vs ${opponentName}` : ''
        }`;

        const defaultBody = 'Los puntajes han cambiado';

        if (
          opponentScore === undefined ||
          oldOpponentScore === undefined ||
          opponentName === undefined
        ) {
          return { title, body: defaultBody };
        }

        const generateBody = (teamName: string, teamScore: number, opponentScore: number) => {
          // The team just scored
          if (teamScore === opponentScore) {
            return `${teamName} vuelve a empatar`;
          }
          if (oldKarmineScore === oldOpponentScore && teamScore > opponentScore) {
            return `${teamName} toma la delantera`;
          }
          if (teamScore > opponentScore) {
            return `${teamName} aumenta su ventaja`;
          }
          if (teamScore < opponentScore) {
            return `${teamName} reduce la brecha`;
          }

          return defaultBody;
        };

        if (oldKarmineScore < karmineScore) {
          return { title, body: generateBody(karmineName, karmineScore, opponentScore) };
        }

        if (oldOpponentScore < opponentScore) {
          return { title, body: generateBody(opponentName, opponentScore, karmineScore) };
        }

        return { title, body: defaultBody };
      },
    ],
    matchFinished: [
      ({
        game,
        karmineName,
        karmineScore,
        opponentName,
        opponentScore,
        showResults,
        scoreType,
      }) => {
        let title = '';

        if (showResults) {
          let scoreTitle = `(${scoreType === 'top' ? 'Top ' : ''}${karmineScore}`;
          if (opponentScore !== undefined)
            scoreTitle += ` - ${scoreType === 'top' ? 'Top ' : ''}${opponentScore}`;
          scoreTitle += ')';
          title += `${scoreTitle} `;
        }

        title += `${game} : ${karmineName}${opponentName ? ` vs ${opponentName}` : ''}`;

        if (opponentScore === undefined || opponentName === undefined) {
          return { title, body: 'El partido ha terminado' };
        }

        if (karmineName.toLowerCase().startsWith('karmine')) {
          karmineName = `La ${karmineName}`;
        }

        return {
          title,
          body:
            karmineScore > opponentScore ? `${karmineName} ha ganado` : `${karmineName} ha perdido`,
        };
      },
    ],
  },
  shareMessages: {
    watchStream: [
      ({ game, karmineName, opponentName, link }) => {
        return `¡Ven a ver el stream de ${game}! ${karmineName}${
          opponentName ? ` vs ${opponentName}` : ''
        } en ${link}`;
      },
    ],
  },
};

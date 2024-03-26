import { Translations } from './Translations';

export const esTranslations: Translations['es'] = {
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
  },
  gameDetails: {
    gamesTitle: 'Games',
    playersTitle: 'Jugadores',
    gamePrefix: 'Game',
    watchReplayText: 'Ver el replay',
    goalsText: 'Goles',
    stopsText: 'Paradas',
    totalText: 'Total de puntos',
    beNotifiedButtonText: 'Ser notificado',
    cancelNotificationButtonText: 'Cancelar la notificación',
    watchStreamButtonText: 'Ver el stream',
    shareStreamButtonText: 'Compartir el stream',
    noGameDetails: 'No hay detalles del partido',
  },
  notifications: {
    matchStarting: ({ game, karmineName, opponentName }) => {
      return {
        title:
          opponentName !== undefined ?
            `${game} : ${karmineName} vs ${opponentName}`
          : `${game} : ${karmineName}`,
        body: 'El partido comenzará pronto',
      };
    },
    matchScoreUpdated: ({
      game,
      karmineName,
      karmineScore,
      oldKarmineScore,
      opponentName,
      opponentScore,
      oldOpponentScore,
      scoreType,
    }) => {
      let title = `${game} : `;
      title += `(${scoreType === 'top' ? 'Top ' : ''}${karmineScore}`;
      if (opponentScore !== undefined)
        title += ` - ${scoreType === 'top' ? 'Top ' : ''}${opponentScore}`;
      title += `) ${karmineName}`;
      if (opponentName) title += ` vs ${opponentName}`;

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
    matchFinished: ({
      game,
      karmineName,
      karmineScore,
      opponentName,
      opponentScore,
      showResults,
      scoreType,
    }) => {
      let title = `${game} : ${karmineName}${opponentName ? ` vs ${opponentName}` : ''}`;
      if (showResults) {
        let score = `(${scoreType === 'top' ? 'Top ' : ''}${karmineScore}`;
        if (opponentScore !== undefined)
          score += ` - ${scoreType === 'top' ? 'Top ' : ''}${opponentScore}`;
        score += ')';

        title = `${score} ${title}`;
      }

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
  },
};

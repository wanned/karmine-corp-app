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
};

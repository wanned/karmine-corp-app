import { Translations } from './Translations';

export const esTranslations: Translations['es'] = {
  home: {
    screenName: 'Inicio',
    nextMatchesTitle: 'Los próximos partidos',
    nextMatchesViewMoreText: 'Ver todos los partidos',
    lastResultsTitle: 'Los últimos resultados',
    lastResultsViewMoreText: 'Ver todos los resultados',
  },
  calendar: {
    screenName: 'Calendario',
  },
  teams: {
    screenName: 'Equipos',
  },
  settings: {
    screenName: 'Configuración',
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
  },
};

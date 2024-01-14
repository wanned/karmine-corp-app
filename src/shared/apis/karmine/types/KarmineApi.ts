import { IsoDate } from '~/shared/types/IsoDate';

export namespace KarmineApi {
  export enum CompetitionName {
    LeagueOfLegendsLFL = 'LeagueOfLegendsLFL',
    LeagueOfLegendsLEC = 'LeagueOfLegendsLEC',
    RocketLeague = 'RocketLeague',
    SuperSmashBrosUltimate = 'SuperSmashBrosUltimate',
    TFT = 'TFT',
    TeamfightTacticsGSC = 'TeamfightTacticsGSC',
    TrackMania = 'TrackMania',
    ValorantVCT = 'ValorantVCT',
    ValorantVCTGC = 'ValorantVCT_GC',
  }

  export type Events = {
    id: number;
    title: string;
    initial: string;
    competition_name: CompetitionName;
    team_domicile: string;
    team_exterieur: string;
    player: string;
    start: IsoDate;
    end: IsoDate;
    link: string;
    hasNotif: number;
    streamLink: string;
  }[];

  export type EventsResults = {
    id: number;
    title: string;
    initial: string;
    competition_name: CompetitionName;
    team_domicile: string;
    team_exterieur: string;
    score_domicile: string;
    score_exterieur: null | string;
    player: 'null' | `${string};${string}`;
    link: string;
    color: `#${string}`;
    start: IsoDate;
  }[];

  export type Games = {
    game_name: CompetitionName;
    game_name_friendly: string;
    game_picture: string;
    ephemere: number;
    hide: number;
  }[];

  export type Instagram = {
    id: number;
    picture: string;
    comment: string;
    shortcode: string;
  }[];

  export type LastNotification = [
    {
      id: number;
      title: string;
      description: string;
      date: IsoDate;
      link: string;
    },
  ];

  export type Leaderboard = [
    {
      [key in CompetitionName]: {
        category: key;
        team: string;
        score: string;
        color: `#${string}`;
      }[];
    },
  ];

  export type Players = {
    twitch_identifier: string;
    twitch_login: string;
    friendly_name: string;
    twitch_picture: string;
    category_game: CompetitionName;
    ephemere: number;
  }[];

  export type Twitch = {
    twitch_identifier: string;
    twitch_login: string;
    friendly_name: string;
    category_game: string;
    sub_category_game: null | string;
    twitch_title: string;
    twitch_picture: string;
    twitch_game: string;
    twitch_uptime: IsoDate;
    twitch_viewers: number;
    thumbnail: string;
  }[];

  type YoutubeVideo = {
    id: string;
    title: string;
    duration: string;
    tags: string;
    thumbnail: string;
    activated: boolean;
  };

  export type Youtube = {
    content: YoutubeVideo[];
    replay: YoutubeVideo[];
    version: 'v2';
  };
}

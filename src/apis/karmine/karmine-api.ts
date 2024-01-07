import { getEventsResults } from './requests/event-results';
import { getEvents } from './requests/events';
import { getGames } from './requests/games';
import { getInstagram } from './requests/instagram';
import { getLastnotification } from './requests/lastnotification';
import { getLeaderboard } from './requests/leaderboard';
import { getPlayers } from './requests/players';
import { getTwitch } from './requests/twitch';
import { getYoutube } from './requests/youtube';

export const karmineApi = {
  getEventsResults,
  getEvents,
  getGames,
  getInstagram,
  getLastnotification,
  getLeaderboard,
  getPlayers,
  getTwitch,
  getYoutube,
};

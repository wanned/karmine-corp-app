import { getEventsResultsSchema } from './get-events-results-schema';
import { getEventsSchema } from './get-events-schema';
import { getPlayersSchema } from './get-players-schema';
import { getTwitchSchema } from './get-twitch-schema';

export const karmineApiSchemas = {
  getEvents: getEventsSchema,
  getEventsResults: getEventsResultsSchema,
  getPlayers: getPlayersSchema,
  getTwitch: getTwitchSchema,
};

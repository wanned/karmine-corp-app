import { assertDefined } from './utils/assert-defined';
import { assertNotEmpty } from './utils/assert-not-empty';
import { filterUndefined } from './utils/filter-undefined';
import { findLeague } from './utils/find-league';
import { findMatch } from './utils/find-match';
import { leagueOfLegendsApi } from '../../league-of-legends-api';
import { getAllLastWindow } from '../get-all-last-window/get-all-last-window';
import { getScheduleAt } from '../get-schedule-at/get-schedule-at';

interface InitialInfos {
  leagueName: string;
  date: Date;
  team1ShortName: string;
  team2ShortName: string;
}

type MatchDetailsData = {
  league: NonNullable<Awaited<ReturnType<typeof findLeague>>>;
  events: Awaited<ReturnType<typeof getScheduleAt>>['data']['schedule']['events'];
  match: NonNullable<Awaited<ReturnType<typeof findMatch>>>['match'];
  matchDetails: Awaited<ReturnType<typeof leagueOfLegendsApi.getEventDetails>>['data'];
  games: Awaited<
    ReturnType<typeof leagueOfLegendsApi.getEventDetails>
  >['data']['event']['match']['games'];
  windowGames: Awaited<ReturnType<typeof getAllLastWindow>>;
  teams: Awaited<ReturnType<typeof leagueOfLegendsApi.getTeams>>['data']['teams'];
};

export const getMatchDetails = (initialInfos: InitialInfos) => {
  // FIXME: This is a hack to correctly get matches of MAD Lions because.
  // They changed their code from MAD to MDK, but the Karmine API still uses MAD.
  if (initialInfos.team1ShortName === 'MAD') {
    initialInfos.team1ShortName = 'MDK';
  }
  if (initialInfos.team2ShortName === 'MAD') {
    initialInfos.team2ShortName = 'MDK';
  }

  const data: MatchDetailsData = {} as MatchDetailsData;

  const saveData = <T extends keyof typeof data, U extends (typeof data)[T]>(
    key: T,
    value: U
  ): U => {
    data[key] = value;
    return value;
  };

  return (
    // Get and save the league
    leagueOfLegendsApi
      .getLeagues()
      .then((leagues) => findLeague(leagues, initialInfos.leagueName))
      .then(assertDefined)
      .then((league) => saveData('league', league))
      // Get and save the schedule of the league at the given date
      .then((league) => getScheduleAt(initialInfos.date, { leagueIds: [league.id] }))
      .then(({ data: { schedule } }) => assertNotEmpty(schedule.events))
      .then((events) => saveData('events', events))
      // Find the match in the schedule
      .then((events) =>
        findMatch(events, {
          team1: initialInfos.team1ShortName,
          team2: initialInfos.team2ShortName,
        })
      )
      .then(assertDefined)
      .then(({ match }) => saveData('match', match))
      // Get the match details
      .then((match) => leagueOfLegendsApi.getEventDetails(match.id))
      .then((matchDetails) => saveData('matchDetails', matchDetails.data))
      .then(({ event }) => assertNotEmpty(event.match.games))
      .then((games) => saveData('games', games))
      // For each game, get the last window
      .then((games) =>
        getAllLastWindow(
          games.map((game) => game.id),
          initialInfos.date
        )
      )
      .then(assertDefined)
      .then(filterUndefined)
      .then((windows) => saveData('windowGames', windows))
      // Get the teams of the match
      .then(() =>
        // TODO: We can memoize this (separate queries for each team)
        leagueOfLegendsApi.getTeams({
          teamIds: data.matchDetails.event.match.teams.map((team) =>
            assertDefined((team as any).id)
          ),
        })
      )
      .then(({ data: { teams } }) => assertNotEmpty(teams))
      .then((teams) => saveData('teams', teams))
      // If everything went well, return the data
      .then(() => data)
      // If something went wrong, return undefined
      .catch((error) => {
        if (error.pipelineCancelled === true) {
          return undefined;
        }

        throw error;
      })
  );
};

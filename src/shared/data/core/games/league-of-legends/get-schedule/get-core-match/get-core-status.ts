type StatusMapping = {
  completed: 'finished';
  finished: 'finished';
  in_game: 'live';
  inProgress: 'live';
  live: 'live';
  unstarted: 'upcoming';
};

export function getCoreStatus<T extends keyof StatusMapping>(status: T): StatusMapping[T] {
  switch (status) {
    case 'finished':
    case 'completed': {
      return 'finished' as StatusMapping[T];
    }
    case 'live':
    case 'inProgress':
    case 'in_game': {
      return 'live' as StatusMapping[T];
    }
    case 'unstarted': {
      return 'upcoming' as StatusMapping[T];
    }
  }

  throw new Error(`Unknown status: ${status}`);
}

import * as v from '@badrap/valita';

const teamMetadataSchema = v.object({
  esportsTeamId: v.string(),
  participantMetadata: v.array(
    v.object({
      esportsPlayerId: v.string().optional(),
      summonerName: v.string(),
      championId: v.string(),
      role: v.union(
        v.literal('top'),
        v.literal('jungle'),
        v.literal('mid'),
        v.literal('bottom'),
        v.literal('support')
      ),
    })
  ),
});

const frameTeamDataSchema = v.object({
  totalKills: v.number(),
});

export const getGameWindowSchema = v.union(
  v.object({
    gameMetadata: v.object({
      blueTeamMetadata: teamMetadataSchema,
      redTeamMetadata: teamMetadataSchema,
    }),
    frames: v.array(
      v.object({
        gameState: v.union(v.literal('in_game'), v.literal('finished'), v.literal('paused')),
        blueTeam: frameTeamDataSchema,
        redTeam: frameTeamDataSchema,
      })
    ),
  }),
  v.undefined()
);

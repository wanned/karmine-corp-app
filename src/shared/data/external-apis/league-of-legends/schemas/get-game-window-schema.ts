import { z } from 'zod';

const teamMetadataSchema = z.object({
  esportsTeamId: z.string(),
  participantMetadata: z.array(
    z.object({
      esportsPlayerId: z.string().optional(),
      summonerName: z.string(),
      championId: z.string(),
      role: z.enum(['top', 'jungle', 'mid', 'bottom', 'support']),
    })
  ),
});

const frameTeamDataSchema = z.object({
  totalKills: z.number().int(),
});

export const getGameWindowSchema = z
  .object({
    gameMetadata: z.object({
      blueTeamMetadata: teamMetadataSchema,
      redTeamMetadata: teamMetadataSchema,
    }),
    frames: z.array(
      z.object({
        gameState: z.enum(['in_game', 'finished', 'paused']),
        blueTeam: frameTeamDataSchema,
        redTeam: frameTeamDataSchema,
      })
    ),
  })
  .nullable();

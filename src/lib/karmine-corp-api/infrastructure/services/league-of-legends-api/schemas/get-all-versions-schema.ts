import { z } from 'zod';

export const getAllVersionsSchema = z.array(z.string());

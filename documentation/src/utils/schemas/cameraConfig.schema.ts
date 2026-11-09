import { z } from 'zod';
import { CameraResolution, CompressionFormat } from '@monkvision/types';

export const CompressionOptionsSchema = z.object({
  format: z.enum(CompressionFormat),
  quality: z.number().gte(0).lte(1),
});

export const CameraConfigSchema = z
  .object({
    resolution: z.enum(CameraResolution).optional(),
    allowImageUpscaling: z.boolean().optional(),
  })
  .and(CompressionOptionsSchema.partial());

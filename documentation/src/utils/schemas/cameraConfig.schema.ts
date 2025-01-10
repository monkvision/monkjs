import { z } from 'zod';
import { CameraResolution, CompressionFormat } from '@monkvision/types';

export const CompressionOptionsSchema = z.object({
  format: z.nativeEnum(CompressionFormat),
  quality: z.number().gte(0).lte(1),
});

export const CameraConfigSchema = z
  .object({
    resolution: z.nativeEnum(CameraResolution).optional(),
    allowImageUpscaling: z.boolean().optional(),
  })
  .and(CompressionOptionsSchema.partial());

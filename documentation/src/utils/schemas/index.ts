import { z } from 'zod';
import { PhotoCaptureAppConfigSchema } from '@site/src/utils/schemas/photoCaptureConfig.schema';
import { VideoCaptureAppConfigSchema } from '@site/src/utils/schemas/videoCaptureConfig.schema';

export const LiveConfigSchema = z
  .object({
    id: z.string(),
    description: z.string(),
  })
  .and(PhotoCaptureAppConfigSchema.or(VideoCaptureAppConfigSchema));

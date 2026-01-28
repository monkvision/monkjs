import { z } from 'zod';
import { PhotoCaptureAppConfigSchema } from '@site/src/utils/schemas/photoCaptureConfig.schema';
import { VideoCaptureAppConfigSchema } from '@site/src/utils/schemas/videoCaptureConfig.schema';

export const PhotoLiveConfigSchema = z
  .object({
    id: z.string(),
    description: z.string(),
  })
  .and(PhotoCaptureAppConfigSchema);

export const VideoLiveConfigSchema = z
  .object({
    id: z.string(),
    description: z.string(),
  })
  .and(VideoCaptureAppConfigSchema);

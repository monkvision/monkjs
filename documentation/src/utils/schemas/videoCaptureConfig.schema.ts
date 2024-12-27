import { z } from 'zod';
import { CaptureWorkflow } from '@monkvision/types';
import { SharedCaptureAppConfigSchema } from '@site/src/utils/schemas/sharedConfig.schema';

export const VideoCaptureAppConfigSchema = z
  .object({
    workflow: z.literal(CaptureWorkflow.VIDEO),
    minRecordingDuration: z.number().optional(),
    maxRetryCount: z.number().optional(),
  })
  .and(SharedCaptureAppConfigSchema);

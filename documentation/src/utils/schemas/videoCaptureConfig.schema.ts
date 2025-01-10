import { z } from 'zod';
import { CaptureWorkflow } from '@monkvision/types';
import { SharedCaptureAppConfigSchema } from '@site/src/utils/schemas/sharedConfig.schema';

export const VideoCaptureAppConfigSchema = z
  .object({
    workflow: z.literal(CaptureWorkflow.VIDEO),
    minRecordingDuration: z.number().optional(),
    maxRetryCount: z.number().optional(),
    enableFastWalkingWarning: z.boolean().optional(),
    enablePhoneShakingWarning: z.boolean().optional(),
    fastWalkingWarningCooldown: z.number().gte(1000).optional(),
    phoneShakingWarningCooldown: z.number().gte(1000).optional(),
  })
  .and(SharedCaptureAppConfigSchema);

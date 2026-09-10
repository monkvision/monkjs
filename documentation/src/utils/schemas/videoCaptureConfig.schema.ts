import { z } from 'zod';
import { CaptureWorkflow, VideoUploadStrategy } from '@monkvision/types';
import { SharedCaptureAppConfigSchema } from '@site/src/utils/schemas/sharedConfig.schema';

export const VideoCaptureAppConfigSchema = z
  .object({
    workflow: z.literal(CaptureWorkflow.VIDEO),
    minRecordingDuration: z.number().optional(),
    maxRetryCount: z.number().optional(),
    videoUploadStrategy: z.nativeEnum(VideoUploadStrategy).optional(),
    frameSelectionInterval: z.number().optional(),
    targetFramesCount: z.number().optional(),
    enableFastWalkingWarning: z.boolean().optional(),
    enablePhoneShakingWarning: z.boolean().optional(),
    fastWalkingWarningCooldown: z.number().gte(1000).optional(),
    phoneShakingWarningCooldown: z.number().gte(1000).optional(),
    enableVideoTutorial: z.boolean().optional(),
    enableHybridVideo: z.boolean().optional(),
    showCloseVideoButton: z.boolean().optional(),
  })
  .and(SharedCaptureAppConfigSchema);

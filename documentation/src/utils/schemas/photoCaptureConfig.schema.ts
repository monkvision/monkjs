import { z } from 'zod';
import { SharedCaptureAppConfigSchema } from '@site/src/utils/schemas/sharedConfig.schema';
import { ComplianceOptionsSchema } from '@site/src/utils/schemas/compliance.schema';
import {
  CaptureWorkflow,
  PhotoCaptureSightGuidelinesOption,
  PhotoCaptureTutorialOption,
  TaskName,
  VehicleType,
} from '@monkvision/types';
import { SteeringWheelDiscriminatedUnionSchema } from '@site/src/utils/schemas/steeringWheel.schema';

export const SightGuidelineSchema = z.object({
  sightIds: z.array(z.string()),
  en: z.string(),
  fr: z.string(),
  de: z.string(),
  nl: z.string(),
});

export const PhotoCaptureAppConfigSchema = z
  .object({
    workflow: z.literal(CaptureWorkflow.PHOTO),
    tasksBySight: z.record(z.string(), z.array(z.nativeEnum(TaskName))).optional(),
    showCloseButton: z.boolean().optional(),
    allowSkipRetake: z.boolean().optional(),
    enableAddDamage: z.boolean().optional(),
    maxUploadDurationWarning: z.number().optional(),
    useAdaptiveImageQuality: z.boolean().optional(),
    sightGuidelines: z.array(SightGuidelineSchema).optional(),
    enableSightGuidelines: z.nativeEnum(PhotoCaptureSightGuidelinesOption).optional(),
    defaultVehicleType: z.nativeEnum(VehicleType),
    allowVehicleTypeSelection: z.boolean(),
    enableTutorial: z.nativeEnum(PhotoCaptureTutorialOption).optional(),
    allowSkipTutorial: z.boolean().optional(),
    enableSightTutorial: z.boolean().optional(),
  })
  .and(SharedCaptureAppConfigSchema)
  .and(ComplianceOptionsSchema)
  .and(SteeringWheelDiscriminatedUnionSchema);

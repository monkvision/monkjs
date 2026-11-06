import { z } from 'zod';
import { SharedCaptureAppConfigSchema } from '@site/src/utils/schemas/sharedConfig.schema';
import { ComplianceOptionsSchema } from '@site/src/utils/schemas/compliance.schema';
import {
  CaptureWorkflow,
  PhotoCaptureSightGuidelinesOption,
  PhotoCaptureSightTutorialOption,
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

export const SightTutorialSchema = z.object({
  imageReferenceBySightId: z.record(z.string(), z.string().nullable()),
  en: z.string(),
  fr: z.string(),
  de: z.string(),
  nl: z.string(),
});

export const PhotoCaptureAppConfigSchema = z
  .object({
    workflow: z.literal(CaptureWorkflow.PHOTO),
    tasksBySight: z.record(z.string(), z.array(z.enum(TaskName))).optional(),
    showCloseButton: z.boolean().optional(),
    allowSkipRetake: z.boolean().optional(),
    allowRerunTasks: z.boolean().optional(),
    enableAddDamage: z.boolean().optional(),
    maxUploadDurationWarning: z.number().optional(),
    useAdaptiveImageQuality: z.boolean().optional(),
    enableNetworkMonitoring: z.boolean().optional(),
    networkPoorThroughputKbps: z.number().optional(),
    sightGuidelines: z.array(SightGuidelineSchema).optional(),
    enableSightGuidelines: z.enum(PhotoCaptureSightGuidelinesOption).optional(),
    defaultVehicleType: z.enum(VehicleType),
    allowVehicleTypeSelection: z.boolean(),
    enableTutorial: z.enum(PhotoCaptureTutorialOption).optional(),
    allowSkipTutorial: z.boolean().optional(),
    enableSightTutorial: z.enum(PhotoCaptureSightTutorialOption).optional(),
    sightTutorial: z.array(SightTutorialSchema).optional(),
    autoDeletePreviousSightImages: z.boolean().optional(),
  })
  .and(SharedCaptureAppConfigSchema)
  .and(ComplianceOptionsSchema)
  .and(SteeringWheelDiscriminatedUnionSchema);

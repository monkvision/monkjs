import { z, CustomErrorParams } from 'zod';
import {
  CameraResolution,
  ComplianceIssue,
  CompressionFormat,
  DeviceOrientation,
  MonkApiPermission,
  SteeringWheelPosition,
  TaskName,
  VehicleType,
} from '@monkvision/types';
import { sights } from '@monkvision/sights';
import { flatten } from '@monkvision/common';

function isValidSightId(sightId: string): boolean {
  return !!sights[sightId];
}

function validateSightIds(value?: string[] | Record<string, unknown>): boolean {
  if (!value) {
    return true;
  }
  const sightIds = Array.isArray(value) ? value : Object.keys(value);
  return sightIds.every(isValidSightId);
}

function getInvalidSightIdsMessage(value?: string[] | Record<string, unknown>): CustomErrorParams {
  if (!value) {
    return {};
  }
  const sightIds = Array.isArray(value) ? value : Object.keys(value);
  const invalidIds = sightIds.filter((sightId) => !isValidSightId(sightId)).join(', ');
  const plural = invalidIds.length > 1 ? 's' : '';
  return { message: `Invalid sight ID${plural} : ${invalidIds}` };
}

function getAllSightsByVehicleType(
  vehicleSights?: Partial<Record<VehicleType, string[]>>,
): string[] | undefined {
  return vehicleSights ? flatten(Object.values(vehicleSights)) : undefined;
}

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

export const CustomComplianceThresholdsSchema = z
  .object({
    blurriness: z.number().gte(0).lte(1).optional(),
    overexposure: z.number().gte(0).lte(1).optional(),
    underexposure: z.number().gte(0).lte(1).optional(),
    lensFlare: z.number().gte(0).lte(1).optional(),
    wetness: z.number().gte(0).lte(1).optional(),
    snowness: z.number().gte(0).lte(1).optional(),
    dirtiness: z.number().gte(0).lte(1).optional(),
    reflections: z.number().gte(0).lte(1).optional(),
    zoom: z
      .object({
        min: z.number().gte(0).lte(1),
        max: z.number().gte(0).lte(1),
      })
      .optional(),
  })
  .refine((thresholds) => !thresholds.zoom || thresholds.zoom.min < thresholds.zoom.max, {
    message: 'Min zoom threshold must be smaller than max zoom threshold',
  });

export const ComplianceOptionsSchema = z.object({
  enableCompliance: z.boolean().optional(),
  enableCompliancePerSight: z
    .array(z.string())
    .optional()
    .refine(validateSightIds, getInvalidSightIdsMessage),
  complianceIssues: z.array(z.nativeEnum(ComplianceIssue)).optional(),
  complianceIssuesPerSight: z
    .record(z.string(), z.array(z.nativeEnum(ComplianceIssue)))
    .optional()
    .refine(validateSightIds, getInvalidSightIdsMessage),
  useLiveCompliance: z.boolean().optional(),
  customComplianceThresholds: CustomComplianceThresholdsSchema.optional(),
  customComplianceThresholdsPerSight: z
    .record(z.string(), CustomComplianceThresholdsSchema)
    .optional()
    .refine(validateSightIds, getInvalidSightIdsMessage),
});

export const SightGuidelineSchema = z.object({
  sightIds: z.array(z.string()),
  en: z.string(),
  fr: z.string(),
  de: z.string(),
  nl: z.string(),
});

export const AccentColorVariantsSchema = z.object({
  xdark: z.string(),
  dark: z.string(),
  base: z.string(),
  light: z.string(),
  xlight: z.string(),
});

export const TextColorVariantsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  disabled: z.string(),
  white: z.string(),
  black: z.string(),
  link: z.string(),
  linkInverted: z.string(),
});

export const BackgroundColorVariantsSchema = z.object({
  dark: z.string(),
  base: z.string(),
  light: z.string(),
});

export const SurfaceColorVariantsSchema = z.object({
  dark: z.string(),
  light: z.string(),
});

export const OutlineColorVariantsSchema = z.object({
  base: z.string(),
});

export const MonkPaletteSchema = z.object({
  primary: AccentColorVariantsSchema,
  secondary: AccentColorVariantsSchema,
  alert: AccentColorVariantsSchema,
  caution: AccentColorVariantsSchema,
  success: AccentColorVariantsSchema,
  information: AccentColorVariantsSchema,
  text: TextColorVariantsSchema,
  background: BackgroundColorVariantsSchema,
  surface: SurfaceColorVariantsSchema,
  outline: OutlineColorVariantsSchema,
});

export const SightsByVehicleTypeSchema = z
  .record(z.nativeEnum(VehicleType), z.array(z.string()))
  .refine(
    (vehicleSights) => validateSightIds(getAllSightsByVehicleType(vehicleSights)),
    (vehicleSights) => getInvalidSightIdsMessage(getAllSightsByVehicleType(vehicleSights)),
  );

export const SteeringWheelDiscriminatedUnionSchema = z.discriminatedUnion(
  'enableSteeringWheelPosition',
  [
    z.object({
      enableSteeringWheelPosition: z.literal(false),
      sights: SightsByVehicleTypeSchema,
    }),
    z.object({
      enableSteeringWheelPosition: z.literal(true),
      defaultSteeringWheelPosition: z.nativeEnum(SteeringWheelPosition),
      sights: z.record(z.nativeEnum(SteeringWheelPosition), SightsByVehicleTypeSchema),
    }),
  ],
);

export const TaskCallbackOptionsSchema = z.object({
  url: z.string(),
  headers: z.record(z.string(), z.string()),
  params: z.record(z.string(), z.unknown()).optional(),
  event: z.string().optional(),
});

export const CreateDamageDetectionTaskOptionsSchema = z.object({
  name: z.literal(TaskName.DAMAGE_DETECTION),
  damageScoreThreshold: z.number().gte(0).lte(1).optional(),
  generateDamageVisualOutput: z.boolean().optional(),
  generateSubimageDamages: z.boolean().optional(),
  generateSubimageParts: z.boolean().optional(),
});

export const CreateHinlTaskOptionsSchema = z.object({
  name: z.literal(TaskName.HUMAN_IN_THE_LOOP),
  callbacks: z.array(TaskCallbackOptionsSchema).optional(),
});

export const InspectionCreateTaskSchema = z
  .nativeEnum(TaskName)
  .or(CreateDamageDetectionTaskOptionsSchema)
  .or(CreateDamageDetectionTaskOptionsSchema);

export const CreateInspectionOptionsSchema = z.object({
  tasks: z.array(InspectionCreateTaskSchema),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  useDynamicCrops: z.boolean().optional(),
});

export const CreateInspectionDiscriminatedUnionSchema = z.discriminatedUnion(
  'allowCreateInspection',
  [
    z.object({
      allowCreateInspection: z.literal(false),
    }),
    z.object({
      allowCreateInspection: z.literal(true),
      createInspectionOptions: CreateInspectionOptionsSchema,
    }),
  ],
);

export const LiveConfigSchema = z
  .object({
    id: z.string(),
    description: z.string(),
    additionalTasks: z.array(z.nativeEnum(TaskName)).optional(),
    tasksBySight: z.record(z.string(), z.array(z.nativeEnum(TaskName))).optional(),
    startTasksOnComplete: z
      .boolean()
      .or(z.array(z.nativeEnum(TaskName)))
      .optional(),
    showCloseButton: z.boolean().optional(),
    enforceOrientation: z.nativeEnum(DeviceOrientation).optional(),
    maxUploadDurationWarning: z.number().positive().or(z.literal(-1)).optional(),
    useAdaptiveImageQuality: z.boolean().optional(),
    allowSkipRetake: z.boolean().optional(),
    enableAddDamage: z.boolean().optional(),
    enableSightGuidelines: z.boolean().optional(),
    sightGuidelines: z.array(SightGuidelineSchema).optional(),
    defaultVehicleType: z.nativeEnum(VehicleType),
    allowManualLogin: z.boolean(),
    allowVehicleTypeSelection: z.boolean(),
    fetchFromSearchParams: z.boolean(),
    apiDomain: z.enum(['api.monk.ai/v1', 'api.preview.monk.ai/v1', 'api.staging.monk.ai/v1']),
    thumbnailDomain: z.enum([
      'europe-west1-monk-staging-321715.cloudfunctions.net/image_resize',
      'europe-west1-monk-preview-321715.cloudfunctions.net/image_resize',
      'europe-west1-monk-prod.cloudfunctions.net/image_resize',
    ]),
    requiredApiPermissions: z.array(z.nativeEnum(MonkApiPermission)).optional(),
    palette: MonkPaletteSchema.partial().optional(),
  })
  .and(SteeringWheelDiscriminatedUnionSchema)
  .and(CreateInspectionDiscriminatedUnionSchema)
  .and(CameraConfigSchema)
  .and(ComplianceOptionsSchema);

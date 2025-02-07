import { z, CustomErrorParams } from 'zod';
import {
  AddDamage,
  CameraResolution,
  ComplianceIssue,
  CompressionFormat,
  CurrencyCode,
  DeviceOrientation,
  MileageUnit,
  MonkApiPermission,
  PhotoCaptureSightGuidelinesOption,
  PhotoCaptureTutorialOption,
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

export const CreatePricingTaskOptionsSchema = z.object({
  name: z.literal(TaskName.PRICING),
  outputFormat: z.string().optional(),
  config: z.string().optional(),
  methodology: z.string().optional(),
});

export const InspectionCreateTaskSchema = z
  .nativeEnum(TaskName)
  .or(CreateDamageDetectionTaskOptionsSchema)
  .or(CreateHinlTaskOptionsSchema)
  .or(CreatePricingTaskOptionsSchema);

export const AdditionalDataSchema = z.record(z.string(), z.unknown());

export const InspectionCreateVehicleSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  plate: z.string().optional(),
  type: z.string().optional(),
  mileageUnit: z.nativeEnum(MileageUnit).optional(),
  mileageValue: z.number().optional(),
  marketValueUnit: z.nativeEnum(CurrencyCode).optional(),
  marketValue: z.number().optional(),
  vin: z.string().optional(),
  color: z.string().optional(),
  exteriorCleanliness: z.string().optional(),
  interiorCleanliness: z.string().optional(),
  dateOfCirculation: z.string().optional(),
  duplicateKeys: z.boolean().optional(),
  expertiseRequested: z.boolean().optional(),
  carRegistration: z.boolean().optional(),
  vehicleQuotation: z.number().optional(),
  tradeInOffer: z.number().optional(),
  ownerInfo: z.record(z.string().optional(), z.unknown()).optional(),
  additionalData: AdditionalDataSchema.optional(),
});

export const CreateInspectionOptionsSchema = z.object({
  tasks: z.array(InspectionCreateTaskSchema),
  vehicle: InspectionCreateVehicleSchema.optional(),
  useDynamicCrops: z.boolean().optional(),
  enablePricingV1: z.boolean().optional(),
  additionalData: AdditionalDataSchema.optional(),
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

const domainsByEnv = {
  staging: {
    api: 'api.staging.monk.ai/v1',
    thumbnail: 'europe-west1-monk-staging-321715.cloudfunctions.net/image_resize',
  },
  preview: {
    api: 'api.preview.monk.ai/v1',
    thumbnail: 'europe-west1-monk-preview-321715.cloudfunctions.net/image_resize',
  },
  production: {
    api: 'api.monk.ai/v1',
    thumbnail: 'europe-west1-monk-prod.cloudfunctions.net/image_resize',
  },
};

const apiDomains = Object.values(domainsByEnv).map((env) => env.api) as [string, ...string[]];
const thumbnailDomains = Object.values(domainsByEnv).map((env) => env.thumbnail) as [
  string,
  ...string[],
];

export const DomainsSchema = z
  .object({
    apiDomain: z.enum(apiDomains),
    thumbnailDomain: z.enum(thumbnailDomains),
  })
  .refine(
    (data) => {
      const apiEnv = Object.values(domainsByEnv).find((env) => env.api === data.apiDomain);
      const thumbnailEnv = Object.values(domainsByEnv).find(
        (env) => env.thumbnail === data.thumbnailDomain,
      );
      return !!apiEnv && apiEnv === thumbnailEnv;
    },
    (data) => ({
      message: `The selected thumbnailDomain must correspond to the selected apiDomain. Please use the corresponding thumbnailDomain: ${
        thumbnailDomains[apiDomains.indexOf(data.apiDomain)]
      }`,
      path: ['thumbnailDomain'],
    }),
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
    addDamage: z.nativeEnum(AddDamage).optional(),
    enableSightGuidelines: z.nativeEnum(PhotoCaptureSightGuidelinesOption).optional(),
    sightGuidelines: z.array(SightGuidelineSchema).optional(),
    enableTutorial: z.nativeEnum(PhotoCaptureTutorialOption).optional(),
    allowSkipTutorial: z.boolean().optional(),
    enableSightTutorial: z.boolean().optional(),
    defaultVehicleType: z.nativeEnum(VehicleType),
    allowManualLogin: z.boolean(),
    allowVehicleTypeSelection: z.boolean(),
    fetchFromSearchParams: z.boolean(),
    requiredApiPermissions: z.array(z.nativeEnum(MonkApiPermission)).optional(),
    palette: MonkPaletteSchema.partial().optional(),
  })
  .and(DomainsSchema)
  .and(SteeringWheelDiscriminatedUnionSchema)
  .and(CreateInspectionDiscriminatedUnionSchema)
  .and(CameraConfigSchema)
  .and(ComplianceOptionsSchema);

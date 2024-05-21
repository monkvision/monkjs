import { z } from 'zod';
import {
  ComplianceIssue,
  CompressionFormat,
  DeviceOrientation,
  SteeringWheelPosition,
  TaskName,
  VehicleType,
} from '@monkvision/types';

const CustomComplianceThresholdsSchema = z.object({
  blurriness: z.number().optional(),
  overexposure: z.number().optional(),
  underexposure: z.number().optional(),
  lensFlare: z.number().optional(),
  wetness: z.number().optional(),
  snowness: z.number().optional(),
  dirtiness: z.number().optional(),
  reflections: z.number().optional(),
  zoom: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
});

const AccentColorVariantsSchema = z.object({
  xdark: z.string(),
  dark: z.string(),
  base: z.string(),
  light: z.string(),
  xlight: z.string(),
});

const TextColorVariantsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  disabled: z.string(),
  white: z.string(),
  black: z.string(),
  link: z.string(),
  linkInverted: z.string(),
});

const BackgroundColorVariantsSchema = z.object({
  dark: z.string(),
  base: z.string(),
  light: z.string(),
});

const SurfaceColorVariantsSchema = z.object({
  dark: z.string(),
  light: z.string(),
});

const OutlineColorVariantsSchema = z.object({
  base: z.string(),
});

const MonkPaletteSchema = z.object({
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

const VehicleSightsSchema = z.record(z.nativeEnum(VehicleType), z.array(z.string()));

const SightsDiscriminatedUnion = z.discriminatedUnion('enableSteeringWheelPosition', [
  z.object({
    enableSteeringWheelPosition: z.literal(false),
    sights: VehicleSightsSchema,
  }),
  z.object({
    enableSteeringWheelPosition: z.literal(true),
    sights: z.record(z.nativeEnum(SteeringWheelPosition), VehicleSightsSchema),
  }),
]);

export const LiveConfigSchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    format: z.nativeEnum(CompressionFormat).optional(),
    quality: z.number().optional(),
    enableCompliance: z.boolean().optional(),
    enableCompliancePerSight: z.array(z.string()).optional(),
    complianceIssues: z.array(z.nativeEnum(ComplianceIssue)).optional(),
    complianceIssuesPerSight: z.record(z.string(), z.nativeEnum(ComplianceIssue)).optional(),
    useLiveCompliance: z.boolean().optional(),
    customComplianceThresholds: CustomComplianceThresholdsSchema.optional(),
    customComplianceThresholdsPerSight: z
      .record(z.string(), CustomComplianceThresholdsSchema)
      .optional(),
    tasksBySight: z.record(z.string(), z.array(z.nativeEnum(TaskName))).optional(),
    startTasksOnComplete: z.union([z.boolean(), z.array(z.nativeEnum(TaskName))]).optional(),
    showCloseButton: z.boolean().optional(),
    enforceOrientation: z.nativeEnum(DeviceOrientation).optional(),
    allowSkipRetake: z.boolean().optional(),
    enableAddDamage: z.boolean().optional(),
    defaultVehicleType: z.nativeEnum(VehicleType),
    allowManualLogin: z.boolean(),
    fetchFromSearchParams: z.boolean(),
    palette: MonkPaletteSchema.partial().optional(),
  })
  .and(SightsDiscriminatedUnion);

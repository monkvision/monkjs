import { z } from 'zod';
import { CurrencyCode, MileageUnit, TaskName } from '@monkvision/types';

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
  dampartConfidenceScore: z
    .array(z.number().positive())
    .min(1, 'At least one size bucket limit is required')
    .max(4, 'At most 4 size bucket limits are allowed')
    .refine((values) => values.every((v, i) => i === 0 || v > values[i - 1]), {
      message: 'Size bucket limits must be sorted in strictly ascending order',
    })
    .optional(),
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

export const CreateWheelAnalysisTaskOptionsSchema = z.object({
  name: z.literal(TaskName.WHEEL_ANALYSIS),
  useLongShots: z.boolean(),
  callbacks: z.array(TaskCallbackOptionsSchema).optional(),
});

export const InspectionCreateTaskSchema = z
  .nativeEnum(TaskName)
  .or(CreateDamageDetectionTaskOptionsSchema)
  .or(CreateHinlTaskOptionsSchema)
  .or(CreatePricingTaskOptionsSchema)
  .or(CreateWheelAnalysisTaskOptionsSchema);

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
  isVideoCapture: z.boolean().optional(),
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

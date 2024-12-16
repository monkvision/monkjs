import { z } from 'zod';
import { ComplianceIssue } from '@monkvision/types';
import {
  getInvalidSightIdsMessage,
  validateSightIds,
} from '@site/src/utils/schemas/sights.validator';

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

import { z } from 'zod';
import { ComplianceIssue } from '@monkvision/types';
import { invalidSightIdsError, validateSightIds } from '@site/src/utils/schemas/sights.validator';

const ComplianceBlockingOptionsSchema = z.object({
  mandatorySights: z.array(z.string()).optional().refine(validateSightIds, invalidSightIdsError),
  maxRetakes: z.number().int().gte(1).optional(),
});

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
  enableCompliance: z.union([z.boolean(), ComplianceBlockingOptionsSchema]).optional(),
  enableCompliancePerSight: z
    .array(z.string())
    .optional()
    .refine(validateSightIds, invalidSightIdsError),
  complianceIssues: z.array(z.enum(ComplianceIssue)).optional(),
  complianceIssuesPerSight: z
    .record(z.string(), z.array(z.enum(ComplianceIssue)))
    .optional()
    .refine(validateSightIds, invalidSightIdsError),
  useLiveCompliance: z.boolean().optional(),
  customComplianceThresholds: CustomComplianceThresholdsSchema.optional(),
  customComplianceThresholdsPerSight: z
    .record(z.string(), CustomComplianceThresholdsSchema)
    .optional()
    .refine(validateSightIds, invalidSightIdsError),
});

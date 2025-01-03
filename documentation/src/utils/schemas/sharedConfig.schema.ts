import { z } from 'zod';
import { DeviceOrientation, MonkApiPermission, TaskName } from '@monkvision/types';
import { CameraConfigSchema } from '@site/src/utils/schemas/cameraConfig.schema';
import { MonkPaletteSchema } from '@site/src/utils/schemas/palette.schema';
import { CreateInspectionDiscriminatedUnionSchema } from '@site/src/utils/schemas/createInspection.schema';

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

export const SharedCaptureAppConfigSchema = z
  .object({
    additionalTasks: z.array(z.nativeEnum(TaskName)).optional(),
    startTasksOnComplete: z.array(z.nativeEnum(TaskName)).or(z.boolean()).optional(),
    enforceOrientation: z.nativeEnum(DeviceOrientation).optional(),
    allowManualLogin: z.boolean().optional(),
    fetchFromSearchParams: z.boolean().optional(),
    requiredApiPermissions: z.array(z.nativeEnum(MonkApiPermission)).optional(),
    palette: MonkPaletteSchema.partial().optional(),
  })
  .and(CameraConfigSchema)
  .and(DomainsSchema)
  .and(CreateInspectionDiscriminatedUnionSchema);

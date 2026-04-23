import { z } from 'zod';
import { DeviceOrientation, MonkApiPermission, TaskName } from '@monkvision/types';
import { CameraConfigSchema } from '@site/src/utils/schemas/cameraConfig.schema';
import { MonkPaletteSchema } from '@site/src/utils/schemas/palette.schema';
import { CreateInspectionDiscriminatedUnionSchema } from '@site/src/utils/schemas/createInspection.schema';

const domainsByEnv = {
  staging: {
    api: ['api.staging.monk.ai/v1', 'monk-us-core-api.gateway.dev.acvauctions.com/v1'],
    thumbnail: [
      'api.staging.monk.ai/image_resize',
      'monk-us-image.gateway.dev.acvauctions.com/image_resize',
    ],
  },
  preview: {
    api: ['api.preview.monk.ai/v1', 'monk-us-core-api.gateway.staging.acvauctions.com/v1'],
    thumbnail: [
      'api.preview.monk.ai/image_resize',
      'monk-us-image.gateway.staging.acvauctions.com/image_resize',
    ],
  },
  production: {
    api: ['api.monk.ai/v1', 'monk-us-core-api.gateway.acvauctions.com/v1'],
    thumbnail: ['api.monk.ai/image_resize', 'monk-us-image.gateway.acvauctions.com/image_resize'],
  },
};

const apiDomains = [...new Set(Object.values(domainsByEnv).flatMap((env) => env.api))] as [
  string,
  ...string[],
];

const thumbnailDomains = [
  ...new Set(Object.values(domainsByEnv).flatMap((env) => env.thumbnail)),
] as [string, ...string[]];

export const DomainsSchema = z
  .object({
    apiDomain: z.enum(apiDomains).optional(),
    thumbnailDomain: z.enum(thumbnailDomains).optional(),
  })
  .refine(
    (data) => {
      const { apiDomain, thumbnailDomain } = data;

      if (!apiDomain || !thumbnailDomain) {
        return true;
      }

      const apiEnv = Object.values(domainsByEnv).find((env) => env.api.includes(apiDomain));
      const thumbnailEnv = Object.values(domainsByEnv).find((env) =>
        env.thumbnail.includes(thumbnailDomain),
      );

      return Boolean(apiEnv && thumbnailEnv && apiEnv === thumbnailEnv);
    },
    {
      message: 'The selected thumbnailDomain must correspond to the selected apiDomain.',
      path: ['thumbnailDomain'],
    },
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

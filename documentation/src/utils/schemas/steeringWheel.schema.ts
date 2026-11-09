import { z } from 'zod';
import { SteeringWheelPosition, VehicleType } from '@monkvision/types';
import {
  getAllSightsByVehicleType,
  getInvalidSightIdsMessage,
  validateSightIds,
} from '@site/src/utils/schemas/sights.validator';

export const SightsByVehicleTypeSchema = z
  .partialRecord(z.enum(VehicleType), z.array(z.string()))
  .refine((vehicleSights) => validateSightIds(getAllSightsByVehicleType(vehicleSights)), {
    error: (issue) =>
      getInvalidSightIdsMessage(
        getAllSightsByVehicleType(issue.input as Partial<Record<VehicleType, string[]>>),
      ),
  });

export const SteeringWheelDiscriminatedUnionSchema = z.discriminatedUnion(
  'enableSteeringWheelPosition',
  [
    z.object({
      enableSteeringWheelPosition: z.literal(false),
      sights: SightsByVehicleTypeSchema,
    }),
    z.object({
      enableSteeringWheelPosition: z.literal(true),
      defaultSteeringWheelPosition: z.enum(SteeringWheelPosition),
      sights: z.partialRecord(z.enum(SteeringWheelPosition), SightsByVehicleTypeSchema),
    }),
  ],
);

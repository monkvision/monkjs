import { z } from 'zod';
import { SteeringWheelPosition, VehicleType } from '@monkvision/types';
import {
  getAllSightsByVehicleType,
  getInvalidSightIdsMessage,
  validateSightIds,
} from '@site/src/utils/schemas/sights.validator';

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

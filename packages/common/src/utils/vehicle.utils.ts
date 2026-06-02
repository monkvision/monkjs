import { vehicles } from '@monkvision/sights';
import { VehicleType, VehicleModel } from '@monkvision/types';

/**
 * Returns the vehicle model corresponding to the given vehicle type.
 */
export function getVehicleModel(vehicleType: VehicleType): VehicleModel {
  const ajustedVehicletype = vehicleType === VehicleType.SUV ? VehicleType.CUV : vehicleType;
  const detail = Object.entries(vehicles)
    .filter(([type]) => type !== VehicleModel.AUDIA7)
    .find(([, details]) => details.type === ajustedVehicletype)?.[1];
  if (detail === undefined) {
    throw new Error(`No vehicle model found for vehicle type ${ajustedVehicletype}`);
  }
  return detail.id;
}

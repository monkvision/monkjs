import { VehicleType } from '@monkvision/types';

export const VEHICLE_TYPE_ORDER = [
  VehicleType.HATCHBACK,
  VehicleType.SEDAN,
  VehicleType.CROSSOVER,
  VehicleType.SUV,
  VehicleType.PICKUP,
  VehicleType.MINIVAN,
  VehicleType.VAN,
  VehicleType.LARGE_SUV,
  VehicleType.CITY,
];

export const DEFAULT_AVAILABLE_VEHICLE_TYPES = [
  VehicleType.SUV,
  VehicleType.CROSSOVER,
  VehicleType.SEDAN,
  VehicleType.HATCHBACK,
  VehicleType.VAN,
  VehicleType.MINIVAN,
  VehicleType.PICKUP,
];

export function getVehicleTypes(availableVehicleTypes?: VehicleType[]): VehicleType[] {
  return (availableVehicleTypes ?? DEFAULT_AVAILABLE_VEHICLE_TYPES).sort(
    (a, b) => VEHICLE_TYPE_ORDER.indexOf(a) - VEHICLE_TYPE_ORDER.indexOf(b),
  );
}

export function getInitialSelectedVehicleType(
  vehicleTypes: VehicleType[],
  selectedVehicleType?: VehicleType,
): VehicleType {
  if (vehicleTypes.length === 0) {
    throw new Error('Empty available vehicle types array given to the VehicleSelection component.');
  }
  if (selectedVehicleType && vehicleTypes.includes(selectedVehicleType)) {
    return selectedVehicleType;
  }
  return vehicleTypes[Math.floor(vehicleTypes.length / 2)];
}

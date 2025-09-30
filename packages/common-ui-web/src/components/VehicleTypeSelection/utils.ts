import { GetInspectionResponse } from '@monkvision/network';
import { sights, vehicles } from '@monkvision/sights';
import { VehicleType } from '@monkvision/types';

export const VEHICLE_TYPE_ORDER = [
  VehicleType.HATCHBACK,
  VehicleType.SEDAN,
  VehicleType.CUV,
  VehicleType.SUV,
  VehicleType.PICKUP,
  VehicleType.MINIVAN,
  VehicleType.VAN,
  VehicleType.LARGE_SUV,
  VehicleType.CITY,
  VehicleType.HGV,
];

export const DEFAULT_AVAILABLE_VEHICLE_TYPES = [
  VehicleType.SUV,
  VehicleType.CUV,
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

export function getVehicleTypeFromInspection(
  response: GetInspectionResponse,
): VehicleType | undefined {
  const imageWithSightId = response.entities.images.find((image) => image.sightId);
  if (!imageWithSightId) {
    return undefined;
  }

  const sight = Object.values(sights).find((s) => s.id === imageWithSightId.sightId);
  if (!sight) {
    return undefined;
  }

  const vehicle = Object.values(vehicles).find((v) => v.id === sight.vehicle);

  return vehicle?.type;
}

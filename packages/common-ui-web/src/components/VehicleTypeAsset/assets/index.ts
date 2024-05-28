import { VehicleType } from '@monkvision/types';
import { VehicleTypeHatchbackAsset } from './hatchback';
import { VehicleTypeCuvAsset } from './cuv';
import { VehicleTypeCityAsset } from './city';
import { VehicleTypePickupAsset } from './pickup';
import { VehicleTypeVanAsset } from './van';
import { VehicleTypeSedanAsset } from './sedan';
import { VehicleTypeLargeSuvAsset } from './largeSuv';
import { VehicleTypeMinivanAsset } from './minivan';
import { VehicleTypeSuvAsset } from './suv';

export const VehicleTypeAssetsMap: Record<VehicleType, string> = {
  [VehicleType.HATCHBACK]: VehicleTypeHatchbackAsset,
  [VehicleType.CUV]: VehicleTypeCuvAsset,
  [VehicleType.CITY]: VehicleTypeCityAsset,
  [VehicleType.PICKUP]: VehicleTypePickupAsset,
  [VehicleType.VAN]: VehicleTypeVanAsset,
  [VehicleType.SEDAN]: VehicleTypeSedanAsset,
  [VehicleType.LARGE_SUV]: VehicleTypeLargeSuvAsset,
  [VehicleType.MINIVAN]: VehicleTypeMinivanAsset,
  [VehicleType.SUV]: VehicleTypeSuvAsset,
};

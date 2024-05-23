import { VehicleType } from '@monkvision/types';
import { HTMLProps } from 'react';
import { VehicleTypeAssetsMap } from './assets';

/**
 * Props accepted by the VehicleTypeAsset component.
 */
export interface VehicleTypeAssetProps extends HTMLProps<HTMLImageElement> {
  /**
   * The vehicle type to display the image of.
   */
  vehicleType: VehicleType;
}

/**
 * This component displays an example image for the given vehicle type.
 */
export function VehicleTypeAsset({ vehicleType, ...passThroughProps }: VehicleTypeAssetProps) {
  return <img {...passThroughProps} src={VehicleTypeAssetsMap[vehicleType]} alt={vehicleType} />;
}

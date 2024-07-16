import { useMonkTheme } from '@monkvision/common';
import { wireFrame } from '@monkvision/sights';
import { PartSelectionOrientation, VehicleModel, VehiclePart } from '@monkvision/types';
import { useMemo } from 'react';
import { DynamicSVG } from '../DynamicSVG';
import { usePartsOverlay } from './hooks';

export interface VehicleDynamicWireframeProps {
  vehicleModel: VehicleModel;
  orientation?: PartSelectionOrientation;
  parts: VehiclePart[];
  /**
   * emit when change in the selected parts.
   */
  onPartsSelected?: (parts: VehiclePart[]) => void;
}

/**
 * Component that displays a dynamic wireframe of a vehicle,
 * allowing the user to select parts of the vehicle.
 */
export function VehicleDynamicWireframe({
  vehicleModel,
  orientation = PartSelectionOrientation.FRONT_LEFT,
  parts,
  onPartsSelected = () => {},
}: VehicleDynamicWireframeProps) {
  const partSelectionWireframes = wireFrame[vehicleModel];
  if (partSelectionWireframes === undefined)
    throw new Error(`No wireframe found for vehicle type ${vehicleModel}`);
  const overlay = partSelectionWireframes[orientation];
  const [selectedParts, getOverlayAttributes] = usePartsOverlay(parts);
  useMemo(() => onPartsSelected(selectedParts), [selectedParts]);
  const { utils } = useMonkTheme();
  return (
    <DynamicSVG
      svg={overlay}
      style={{
        width: '100%',
        color: utils.getColor('text-primary'),
      }}
      getAttributes={getOverlayAttributes}
    />
  );
}

import { PartSelectionOrientation, VehicleModel, VehiclePart } from '@monkvision/types';
import { useState } from 'react';
import { Icon } from '../../icons';
import { VehicleDynamicWireframe } from '../VehicleDynamicWireframe';
import { useMergeMultipleEvent } from './hooks';

export interface VehiclePartSelectionProps {
  vehicleModel: VehicleModel;
  orientation?: PartSelectionOrientation;
  /**
   * emit when change in the selected parts.
   */
  onPartsSelected?: (parts: VehiclePart[]) => void;
}

/**
 * Move through different orientations of the vehicle wireframe.
 * And choose the parts
 */
export function VehiclePartSelection({
  vehicleModel,
  orientation: initialOrientation,
  onPartsSelected,
}: VehiclePartSelectionProps) {
  const partSelectionOrientations = [
    PartSelectionOrientation.FRONT_LEFT,
    PartSelectionOrientation.REAR_LEFT,
    PartSelectionOrientation.REAR_RIGHT,
    PartSelectionOrientation.FRONT_RIGHT,
  ];
  const [orientation, setOrientation] = useState(
    initialOrientation ?? partSelectionOrientations[0],
  );
  const moveOrientation = (direction: 'next' | 'previous') => {
    const currentIndex = partSelectionOrientations.indexOf(orientation);
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % partSelectionOrientations.length
        : (currentIndex - 1 + partSelectionOrientations.length) % partSelectionOrientations.length;
    setOrientation(partSelectionOrientations[nextIndex]);
  };
  const [selectedParts, partSelectedOrientation] = useMergeMultipleEvent<
    VehiclePart,
    PartSelectionOrientation
  >(partSelectionOrientations, onPartsSelected ?? (() => {}));
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        inset: '0 0 0 0',
      }}
    >
      <Icon icon='undo' primaryColor='text-primary' onClick={() => moveOrientation('next')} />
      <VehicleDynamicWireframe
        vehicleModel={vehicleModel}
        orientation={orientation}
        parts={selectedParts}
        onPartsSelected={partSelectedOrientation(orientation)}
      />
      <Icon icon='redo' primaryColor='text-primary' onClick={() => moveOrientation('previous')} />
    </div>
  );
}

import { PartSelectionOrientation, VehicleModel, VehiclePart } from '@monkvision/types';
import { useEffect, useState } from 'react';
import { useMonkTheme } from '@monkvision/common';
import { Icon } from '../icons';
import { VehicleDynamicWireframe, VehicleDynamicWireframeProps } from './VehicleDynamicWireframe';

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
  onPartsSelected = () => {},
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
  const [selectedParts, setSelectedParts] = useState<Array<VehiclePart>>([]);
  useEffect(() => {
    onPartsSelected(selectedParts);
  }, [selectedParts]);
  const togglePart = (part: VehiclePart) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((p) => p !== part));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };
  const { utils } = useMonkTheme();
  const getPartAttributes: VehicleDynamicWireframeProps['getPartAttributes'] = (
    part: VehiclePart,
  ) => ({
    style: {
      // TODO: need to finalize the color for the selected parts.
      fill: selectedParts.includes(part) ? '#2196f3' : undefined,
      stroke: utils.getColor('text-primary'),
      display: 'block',
    },
  });
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        inset: '0 0 0 0',
        gap: '30px',
      }}
    >
      <Icon
        icon='rotate-left'
        primaryColor='text-primary'
        onClick={() => moveOrientation('next')}
      />
      <VehicleDynamicWireframe
        vehicleModel={vehicleModel}
        orientation={orientation}
        onClickPart={togglePart}
        getPartAttributes={getPartAttributes}
      />
      <Icon
        icon='rotate-right'
        primaryColor='text-primary'
        onClick={() => moveOrientation('previous')}
      />
    </div>
  );
}

import { PartSelectionOrientation, VehiclePart, VehicleType } from '@monkvision/types';
import { useState } from 'react';
import { useMonkTheme } from '@monkvision/common';
import { Icon } from '../../icons';
import { VehicleDynamicWireframe, VehicleDynamicWireframeProps } from '../VehicleDynamicWireframe';
import { styles } from './VehiclePartSelection.style';

/**
 * Props accepted by the VehiclePartSelection component
 */
export interface VehiclePartSelectionProps {
  /**
   * Vehicle type to display the wireframe for.
   */
  vehicleType: VehicleType;
  /**
   * The initial orientation of the wireframe when the component is mounted.
   *
   * @default PartSelectionOrientation.FRONT_LEFT
   */
  orientation?: PartSelectionOrientation;
  /**
   * Callback called when the selected parts are updated (the user selects or unselects a new part).
   */
  onPartsSelected?: (parts: VehiclePart[]) => void;
}

const ORIENTATIONS = [
  PartSelectionOrientation.FRONT_LEFT,
  PartSelectionOrientation.REAR_LEFT,
  PartSelectionOrientation.REAR_RIGHT,
  PartSelectionOrientation.FRONT_RIGHT,
];

/**
 * Component that displays a rotatable vehicle wireframe that allows the user to select multiple vehicle parts.
 */
export function VehiclePartSelection({
  vehicleType,
  orientation: initialOrientation,
  onPartsSelected = () => {},
}: VehiclePartSelectionProps) {
  const [orientation, setOrientation] = useState(initialOrientation ?? ORIENTATIONS[0]);
  const [selectedParts, setSelectedParts] = useState<Array<VehiclePart>>([]);
  const { palette } = useMonkTheme();

  const rotateRight = () => {
    const currentIndex = ORIENTATIONS.indexOf(orientation);
    const nextIndex = (currentIndex + 1) % ORIENTATIONS.length;
    setOrientation(ORIENTATIONS[nextIndex]);
  };
  const rotateLeft = () => {
    const currentIndex = ORIENTATIONS.indexOf(orientation);
    const nextIndex = (currentIndex - 1 + ORIENTATIONS.length) % ORIENTATIONS.length;
    setOrientation(ORIENTATIONS[nextIndex]);
  };
  const togglePart = (part: VehiclePart) => {
    const newSelectedParts = selectedParts.includes(part)
      ? selectedParts.filter((p) => p !== part)
      : [...selectedParts, part];
    setSelectedParts(newSelectedParts);
    onPartsSelected(newSelectedParts);
  };
  const getPartAttributes: VehicleDynamicWireframeProps['getPartAttributes'] = (
    part: VehiclePart,
  ) => ({
    style: {
      // TODO: need to finalize the color for the selected parts.
      fill: selectedParts.includes(part) ? palette.primary.base : undefined,
      stroke: palette.text.primary,
      display: 'block',
    },
  });

  return (
    <div style={styles['wrapper']}>
      <Icon icon='rotate-left' primaryColor='text-primary' onClick={rotateRight} />
      <VehicleDynamicWireframe
        vehicleType={vehicleType}
        orientation={orientation}
        onClickPart={togglePart}
        getPartAttributes={getPartAttributes}
      />
      <Icon icon='rotate-right' primaryColor='text-primary' onClick={rotateLeft} />
    </div>
  );
}

import { PartSelectionOrientation, Styles, VehiclePart, VehicleType } from '@monkvision/types';
import { useState } from 'react';
import { Icon } from '../../icons';
import { VehicleDynamicWireframe, VehicleDynamicWireframeProps } from '../VehicleDynamicWireframe';
import { ICON_SIZE, styles } from './VehiclePartSelection.style';

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
  /**
   * The name or the hexcode of the color to apply to the part selected.
   *
   * @default '#0A84FF'
   */
  primaryColor?: string;
  /**
   * The name or the hexcode of the color to apply to the vehicle wireframe.
   *
   * @default '#ffffff'
   */
  secondaryColor?: string;
}

const ORIENTATIONS_ORDER = [
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
  orientation: initialOrientation = PartSelectionOrientation.FRONT_LEFT,
  onPartsSelected = () => {},
  primaryColor = '#0A84FF',
  secondaryColor = '#ffffff',
}: VehiclePartSelectionProps) {
  const [orientation, setOrientation] = useState(initialOrientation);
  const [selectedParts, setSelectedParts] = useState<VehiclePart[]>([]);

  const rotateRight = () => {
    const currentIndex = ORIENTATIONS_ORDER.indexOf(orientation);
    const nextIndex = (currentIndex + 1) % ORIENTATIONS_ORDER.length;
    setOrientation(ORIENTATIONS_ORDER[nextIndex]);
  };
  const rotateLeft = () => {
    const currentIndex = ORIENTATIONS_ORDER.indexOf(orientation);
    const nextIndex = (currentIndex - 1 + ORIENTATIONS_ORDER.length) % ORIENTATIONS_ORDER.length;
    setOrientation(ORIENTATIONS_ORDER[nextIndex]);
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
  ): Styles => ({
    style: {
      fill: selectedParts.includes(part) ? primaryColor : undefined,
      stroke: secondaryColor,
    },
  });

  return (
    <div style={styles['wrapper']}>
      <div style={styles['leftArrowContainer']}>
        <Icon
          icon='rotate-left'
          primaryColor='text-primary'
          onClick={rotateRight}
          size={ICON_SIZE}
        />
        <span style={styles['spacer']}></span>
      </div>
      <div style={styles['wireframeContainer']}>
        <VehicleDynamicWireframe
          vehicleType={vehicleType}
          orientation={orientation}
          onClickPart={togglePart}
          getPartAttributes={getPartAttributes}
        />
      </div>
      <Icon icon='rotate-right' primaryColor='text-primary' onClick={rotateLeft} size={ICON_SIZE} />
    </div>
  );
}

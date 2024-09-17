import { Part, PartSelectionOrientation, VehiclePart, VehicleType } from '@monkvision/types';
import { useEffect, useState } from 'react';
import { useMonkTheme } from '@monkvision/common';
import {
  Icon,
  VehicleDynamicWireframe,
  VehicleDynamicWireframeProps,
} from '@monkvision/common-ui-web';
import { styles } from './Vehicle360.styles';
import { Vehicle360Wireframe } from '../Vehicle360Wireframe/Vehicle360Wireframe';

/**
 * Props accepted by the VehiclePartSelection component
 */
export interface Vehicle360Props {
  /**
   * Vehicle type to display the wireframe for.
   */
  vehicleType: VehicleType;
  partSelected?: VehiclePart;
  priceByPart?: { vehiclePart?: VehiclePart; price: number }[];
  /*
   * The initial orientation of the wireframe when the component is mounted.
   *
   * @default PartSelectionOrientation.FRONT_LEFT
   */
  orientation?: PartSelectionOrientation;
  /**
   * Callback called when the selected parts are updated (the user selects or unselects a new part).
   */
  onPartsSelected?: (parts: VehiclePart[]) => void;
  enableMultiplePartSelection?: boolean;
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
export function Vehicle360({
  vehicleType,
  priceByPart,
  partSelected,
  orientation: initialOrientation,
  onPartsSelected = () => {},
  enableMultiplePartSelection = true,
}: Vehicle360Props) {
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
    let newSelectedParts;
    if (enableMultiplePartSelection) {
      newSelectedParts = selectedParts.includes(part)
        ? selectedParts.filter((p) => p !== part)
        : [...selectedParts, part];
    } else {
      newSelectedParts = selectedParts.includes(part) ? [] : [part];
    }
    setSelectedParts(newSelectedParts);
    onPartsSelected(newSelectedParts);
  };

  const getPartAttributes: VehicleDynamicWireframeProps['getPartAttributes'] = (
    part: VehiclePart,
  ) => ({
    style: {
      // TODO: need to finalize the color for the selected parts.
      fill: selectedParts.includes(part) ? palette.primary.base : undefined,
      stroke: palette.text.black,
      display: 'block',
    },
  });

  useEffect(() => {
    if (!partSelected) {
      setSelectedParts([]);
    }
  }, [partSelected]);

  return (
    <div style={styles['wrapper']}>
      <Vehicle360Wireframe
        priceByPart={priceByPart}
        vehicleType={vehicleType}
        orientation={orientation}
        onClickPart={togglePart}
        getPartAttributes={getPartAttributes}
      />
      <div
        style={{
          position: 'absolute',
          top: '600px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Icon icon='rotate-left' primaryColor='text-secondary' onClick={rotateRight} />
        <Icon icon='rotate-right' primaryColor='text-secondary' onClick={rotateLeft} />
      </div>
    </div>
  );
}

import { PartSelectionOrientation, VehiclePart, VehicleType } from '@monkvision/types';
import { SVGProps } from 'react';
import { DynamicSVG } from '../DynamicSVG';
import { useVehicleDynamicWireframe } from './hooks';
import { styles } from './VehicleDynamicWireframe.style';

/**
 * Props accepted by the VehicleDynamicWireframe component.
 */
export interface VehicleDynamicWireframeProps {
  /**
   * Vehicle type to display the wireframe for.
   */
  vehicleType: VehicleType;
  /**
   * The orientation of the wireframe.
   *
   * @default PartSelectionOrientation.FRONT_LEFT
   */
  orientation?: PartSelectionOrientation;
  /**
   * Callback when the user clicks a part.
   */
  onClickPart?: (parts: VehiclePart) => void;
  /**
   * Callback used to customize the display style of each vehicle part on the wireframe.
   * See `DynamicSVGCustomizationFunctions` for more details.
   *
   * @see DynamicSVGCustomizationFunctions
   */
  getPartAttributes?: (part: VehiclePart) => SVGProps<SVGElement>;
}

/**
 * Component that displays a dynamic wireframe of a vehicle, allowing the user to select parts of the vehicle.
 */
export function VehicleDynamicWireframe({
  vehicleType,
  onClickPart = () => {},
  orientation = PartSelectionOrientation.FRONT_LEFT,
  getPartAttributes = () => ({}),
}: VehicleDynamicWireframeProps) {
  const { overlay, getAttributes } = useVehicleDynamicWireframe({
    vehicleType,
    orientation,
    onClickPart,
    getPartAttributes,
  });

  return <DynamicSVG svg={overlay} style={styles['svg']} getAttributes={getAttributes} />;
}

import { PartSelectionOrientation } from '@monkvision/types';
import { DynamicSVG } from '../DynamicSVG';
import { useVehicleDynamicWireframe, VehicleDynamicWireframeProps } from './hooks';
import { styles } from './VehicleDynamicWireframe.style';

/**
 * Component that displays a dynamic wireframe of a vehicle, allowing the user to select parts of the vehicle.
 */
export function VehicleDynamicWireframe({
  vehicleType,
  onClickPart = () => {},
  orientation = PartSelectionOrientation.FRONT_LEFT,
  getPartAttributes = () => ({}),
  validatedParts = [],
}: VehicleDynamicWireframeProps) {
  const { overlay, getAttributes } = useVehicleDynamicWireframe({
    vehicleType,
    orientation,
    onClickPart,
    getPartAttributes,
    validatedParts,
  });

  return <DynamicSVG svg={overlay} style={styles['svg']} getAttributes={getAttributes} />;
}

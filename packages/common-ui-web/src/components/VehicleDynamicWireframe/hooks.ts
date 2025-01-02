import { partSelectionWireframes } from '@monkvision/sights';
import { getVehicleModel } from '@monkvision/common';
import { VehicleType, VehiclePart, PartSelectionOrientation } from '@monkvision/types';
import { SVGProps, useCallback, useMemo } from 'react';
import { styles } from './VehicleDynamicWireframe.style';

function isCarPartElement(element: SVGElement): boolean {
  return element.id !== '' && element.classList.contains('car-part');
}

function getWireframes(vehicleType: VehicleType, orientation: PartSelectionOrientation) {
  const wireframes = partSelectionWireframes[getVehicleModel(vehicleType)];
  if (wireframes === undefined) {
    throw new Error(`No wireframe found for vehicle type ${vehicleType}`);
  }
  return wireframes[orientation];
}

export interface VehicleDynamicWireframeParams {
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

export function useVehicleDynamicWireframe({
  vehicleType,
  orientation = PartSelectionOrientation.FRONT_LEFT,
  onClickPart = () => {},
  getPartAttributes = () => ({}),
}: VehicleDynamicWireframeParams) {
  const overlay = useMemo(
    () => getWireframes(vehicleType, orientation),
    [vehicleType, orientation],
  );

  const getAttributes = useCallback(
    (element, groups) => {
      const groupElement: SVGGElement | undefined = groups[0];
      let part: VehiclePart;
      if (groupElement && isCarPartElement(groupElement)) {
        part = groupElement.id as VehiclePart;
      } else if (isCarPartElement(element)) {
        part = element.id as VehiclePart;
      } else {
        return { style: styles['notCarPart'] };
      }
      const attributes = getPartAttributes(part);
      if (element.tagName === 'g') {
        delete attributes.style;
      }
      if (element.classList.contains('selectable') && element.id) {
        attributes.onClick = () => onClickPart(part);
        attributes.style = { ...attributes.style, ...styles['selectable'] };
      }
      return attributes;
    },
    [onClickPart, getPartAttributes],
  );

  return { overlay, getAttributes };
}

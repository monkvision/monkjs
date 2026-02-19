import { partSelectionWireframes } from '@monkvision/sights';
import { getVehicleModel } from '@monkvision/common';
import { VehicleType, VehiclePart, PartSelectionOrientation } from '@monkvision/types';
import { SVGProps, useCallback, useMemo } from 'react';
import { styles } from './VehicleDynamicWireframe.style';

function isCarPartElement(element: SVGElement): boolean {
  return element.id !== '' && element.classList.contains('car-part');
}

function getWireframes(vehicleType: VehicleType, orientation: PartSelectionOrientation): string {
  const wireframes = partSelectionWireframes[getVehicleModel(vehicleType)];
  if (wireframes === undefined) {
    throw new Error(`No wireframe found for vehicle type ${vehicleType}`);
  }
  return wireframes[orientation];
}

function isDamagePill(pillId?: SVGElement) {
  return pillId?.id.startsWith('damage-pill_');
}

function getPillPart(elementId: string) {
  return elementId.substring(12);
}

function isPartValidated(element: SVGElement, parts?: VehiclePart[]) {
  return element.id && parts?.some((part) => element.id.includes(part));
}

/**
 * Props accepted by the VehicleDynamicWireframe component.
 */
export interface VehicleDynamicWireframeProps {
  /**
   * The type of vehicle for which the wireframe will be displayed.
   */
  vehicleType: VehicleType;
  /**
   * The orientation of the wireframe.
   *
   * @default PartSelectionOrientation.FRONT_LEFT
   */
  orientation?: PartSelectionOrientation;
  /**
   * List of vehicle parts that are validated by the user.
   * A validated part will be marked with a green dot on the wireframe.
   */
  validatedParts?: VehiclePart[];
  /**
   * Callback when the user clicks on a vehicle part.
   */
  onClickPart?: (parts: VehiclePart) => void;
  /**
   * Customizes the display attributes (e.g., styles, colors) of vehicle parts.
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
  validatedParts = [],
}: VehicleDynamicWireframeProps) {
  const overlay = useMemo(
    () => getWireframes(vehicleType, orientation),
    [vehicleType, orientation],
  );

  const getAttributes = useCallback(
    (element: SVGElement, groups: SVGGElement[]) => {
      const groupElement: SVGGElement | undefined = groups[0];
      const isValidatedPartPill =
        (isDamagePill(groupElement) || isDamagePill(element)) &&
        (isPartValidated(element, validatedParts) || element.classList.contains('severity-none'));

      let part: VehiclePart;
      if (groupElement && isCarPartElement(groupElement)) {
        part = groupElement.id as VehiclePart;
      } else if (isCarPartElement(element)) {
        part = element.id as VehiclePart;
      } else if (groupElement && isValidatedPartPill) {
        part = getPillPart(groupElement.id) as VehiclePart;
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
      if (isValidatedPartPill) {
        if (groupElement) {
          attributes.style = { display: 'flow' };
          if (element.classList.contains('severity-none')) {
            attributes.style = { ...attributes.style, fill: 'green' };
          }
        }
      }
      return attributes;
    },
    [onClickPart, getPartAttributes],
  );

  return { overlay, getAttributes };
}

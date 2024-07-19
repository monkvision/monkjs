import { useMonkTheme } from '@monkvision/common';
import {
  PartSelectionOrientation,
  VehiclePart,
  VehicleType,
  VehicleTypeMapVehicleModel,
} from '@monkvision/types';
import { SVGProps } from 'react';
import { partSelectionWireframes } from '@monkvision/sights';
import { DynamicSVG, DynamicSVGCustomizationFunctions } from './DynamicSVG';

export interface VehicleDynamicWireframeProps {
  /**
   * Vehicle type to display the wireframe for.
   */
  vehicleType: VehicleType;
  /**
   * The orientation of the wireframe.
   */
  orientation?: PartSelectionOrientation;
  /**
   * Callback to return the clicked part.
   */
  onClickPart?: (parts: VehiclePart) => void;
  /**
   * Callback to return the attributes of the SVG HTML element from parent based on style.
   */
  getPartAttributes?: (part: VehiclePart) => SVGProps<SVGElement>;
}

function isCarPartElement(element: SVGElement) {
  return element.id !== '' && element.classList.contains('car-part');
}

function createGetAttributesCallback(
  onClickPart: NonNullable<VehicleDynamicWireframeProps['onClickPart']>,
  getPartAttributes: NonNullable<VehicleDynamicWireframeProps['getPartAttributes']>,
): NonNullable<DynamicSVGCustomizationFunctions['getAttributes']> {
  return (element, groups) => {
    const groupElement: SVGGElement | undefined = groups[0];
    let part: VehiclePart;
    if (groupElement && isCarPartElement(groupElement)) {
      part = groupElement.id as VehiclePart;
    } else if (isCarPartElement(element)) {
      part = element.id as VehiclePart;
    } else {
      return { style: { display: 'none' } };
    }
    const attributes = getPartAttributes(part);
    if (element.tagName === 'g') {
      delete attributes.style;
    }
    if (element.classList.contains('selectable') && element.id) {
      attributes.onClick = () => onClickPart(part);
      attributes.style = attributes.style ?? {};
      attributes.style.pointerEvents = 'fill';
      attributes.style.cursor = 'pointer';
    }
    return attributes;
  };
}

/**
 * Component that displays a dynamic wireframe of a vehicle, allowing the user to select parts of the vehicle.
 */
export function VehicleDynamicWireframe({
  vehicleType,
  orientation = PartSelectionOrientation.FRONT_LEFT,
  onClickPart = () => {},
  getPartAttributes = () => ({}),
}: VehicleDynamicWireframeProps) {
  const wireframes = partSelectionWireframes[VehicleTypeMapVehicleModel[vehicleType]];
  if (wireframes === undefined) {
    throw new Error(`No wireframe found for vehicle type ${vehicleType}`);
  }
  const overlay = wireframes[orientation];
  const { utils } = useMonkTheme();

  return (
    <DynamicSVG
      svg={overlay}
      style={{
        width: '100%',
        color: utils.getColor('text-primary'),
      }}
      getAttributes={createGetAttributesCallback(onClickPart, getPartAttributes)}
    />
  );
}

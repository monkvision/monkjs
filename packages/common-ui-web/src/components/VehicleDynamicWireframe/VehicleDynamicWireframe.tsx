import { useMonkTheme } from '@monkvision/common';
import {
  PartSelectionOrientation,
  VehicleModel,
  VehiclePart,
  VehicleType,
} from '@monkvision/types';
import { SVGProps } from 'react';
import { partSelectionWireframes, vehicles } from '@monkvision/sights';
import { DynamicSVG, DynamicSVGCustomizationFunctions } from '../DynamicSVG';
import { styles } from './VehicleDynamicWireframe.style';

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
      return { style: styles['notCarPart'] };
    }
    const attributes = getPartAttributes(part);
    if (element.tagName === 'g') {
      delete attributes.style;
    }
    if (element.classList.contains('selectable') && element.id) {
      attributes.onClick = () => onClickPart(part);
      attributes.style = { ...attributes.style, ...styles['selectAble'] };
    }
    return attributes;
  };
}

function getVehicleModel(vehicleType: VehicleType): VehicleModel {
  const detail = Object.entries(vehicles)
    .filter(([type]) => type !== VehicleModel.AUDIA7)
    .find(([, details]) => details.type === vehicleType)?.[1];
  if (detail === undefined) {
    throw new Error(`No vehicle model found for vehicle type ${vehicleType}`);
  }
  return detail.id;
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
  const wireframes = partSelectionWireframes[getVehicleModel(vehicleType)];
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

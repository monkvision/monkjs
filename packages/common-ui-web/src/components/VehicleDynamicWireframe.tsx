import { useMonkTheme } from '@monkvision/common';
import { wireFrame } from '@monkvision/sights';
import { PartSelectionOrientation, VehicleModel, VehiclePart } from '@monkvision/types';
import { SVGProps } from 'react';
import { DynamicSVG, DynamicSVGCustomizationFunctions } from './DynamicSVG';

export interface VehicleDynamicWireframeProps {
  vehicleModel: VehicleModel;
  orientation?: PartSelectionOrientation;
  onClickPart?: (parts: VehiclePart) => void;
  getPartAttributes?: (part: VehiclePart) => SVGProps<SVGElement>;
}

const validElement = (element: SVGElement): boolean =>
  element.id !== '' && element.classList.contains('car-part');

function getOverlayAttributes(
  onClickPart: NonNullable<VehicleDynamicWireframeProps['onClickPart']>,
  getPartAttributes: NonNullable<VehicleDynamicWireframeProps['getPartAttributes']>,
): NonNullable<DynamicSVGCustomizationFunctions['getAttributes']> {
  return (element, groups) => {
    const groupElement: (typeof groups)[number] | undefined = groups[0];
    let part: VehiclePart;
    if (groupElement && validElement(groupElement)) {
      part = groupElement.id as VehiclePart;
    } else if (validElement(element)) {
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
 * Component that displays a dynamic wireframe of a vehicle,
 * allowing the user to select parts of the vehicle.
 */
export function VehicleDynamicWireframe({
  vehicleModel,
  orientation = PartSelectionOrientation.FRONT_LEFT,
  onClickPart = () => {},
  getPartAttributes = () => ({}),
}: VehicleDynamicWireframeProps) {
  const partSelectionWireframes = wireFrame[vehicleModel];
  if (partSelectionWireframes === undefined)
    throw new Error(`No wireframe found for vehicle type ${vehicleModel}`);
  const overlay = partSelectionWireframes[orientation];
  const { utils } = useMonkTheme();
  return (
    <DynamicSVG
      svg={overlay}
      style={{
        width: '100%',
        color: utils.getColor('text-primary'),
      }}
      getAttributes={getOverlayAttributes(onClickPart, getPartAttributes)}
    />
  );
}

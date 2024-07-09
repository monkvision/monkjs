import { useMonkTheme } from '@monkvision/common';
import { wireFrame } from '@monkvision/sights';
import { PartSelectionOrientation, VehicleModel, VehiclePart } from '@monkvision/types';
import { CSSProperties, SVGProps, useMemo, useState } from 'react';
import { DynamicSVG, DynamicSVGCustomizationFunctions } from './DynamicSVG';

export interface VehicleDynamicWireframeProps {
  vehicleModel: VehicleModel;
  orientation?: PartSelectionOrientation;
  parts: VehiclePart[];
  /**
   * emit when change in the selected parts.
   */
  onPartsSelected?: (parts: VehiclePart[]) => void;
}

/**
 * Component that displays a dynamic wireframe of a vehicle,
 * allowing the user to select parts of the vehicle.
 */
export function VehicleDynamicWireframe({
  vehicleModel,
  orientation = PartSelectionOrientation.FRONT_LEFT,
  parts,
  onPartsSelected = () => {},
}: VehicleDynamicWireframeProps) {
  const partSelectionWireframes = wireFrame[vehicleModel];
  if (partSelectionWireframes === undefined)
    throw new Error(`No wireframe found for vehicle type ${vehicleModel}`);
  const overlay = partSelectionWireframes[orientation];
  const [selectedParts, setSelectedParts] = useState<Array<VehiclePart>>(parts ?? []);
  useMemo(() => onPartsSelected(selectedParts), [selectedParts]);
  const { utils } = useMonkTheme();

  function getOverlayAttributes(
    element: Parameters<NonNullable<DynamicSVGCustomizationFunctions['getAttributes']>>[0],
    groups: Parameters<NonNullable<DynamicSVGCustomizationFunctions['getAttributes']>>[1],
  ): ReturnType<NonNullable<DynamicSVGCustomizationFunctions['getAttributes']>> {
    /** new calculated style */
    const style: CSSProperties = {};
    /** all the properties should passed to the element tag */
    const otherProps: SVGProps<SVGElement> = { display: 'none' };
    const groupElement = groups[0];

    if (element.classList.contains('car-part')) {
      style['stroke'] = utils.getColor('text-primary');
      style['display'] = 'block';
      style['pointerEvents'] = 'fill';
    }
    // TODO: need to finalize the color for the selected parts.
    if (selectedParts.includes(element.id as VehiclePart)) style['fill'] = '#2196f3';

    if (element.classList.contains('selectable')) {
      style['cursor'] = 'pointer';
      otherProps['onClick'] = () => {
        const id = (element as SVGElement).id as VehiclePart;
        if (selectedParts.includes(id))
          setSelectedParts(selectedParts.filter((part) => part !== id));
        else setSelectedParts([...selectedParts, id]);
      };
    }
    /**
     * Mainly to copy the style from the group element to the overlay element.
     * because class styles present in svg file prevent inheriting the styles from the parent.
     */
    if (groupElement) {
      const grpOverlayAttributes = getOverlayAttributes(groupElement, []);
      return {
        /**
         * not needed for right now. if needed uncomment it.
         * WARN: some of the properties are not need to applied twice.
         * for eg: onClick, pointerEvents, display
         * but onClick present hear then it will cause the issue.
         * make sure to remove it from here if you are uncommenting it.
         */
        // ...grpOverlayAttributes,
        ...otherProps,
        style: { ...grpOverlayAttributes.style, ...style },
      };
    }
    return { style, ...otherProps };
  }
  return (
    <DynamicSVG
      svg={overlay}
      style={{
        width: '100%',
        color: '#fff',
      }}
      getAttributes={getOverlayAttributes}
    />
  );
}

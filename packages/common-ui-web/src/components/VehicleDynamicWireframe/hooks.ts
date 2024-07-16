import { CSSProperties, Dispatch, Reducer, ReducerAction, SVGProps, useReducer } from 'react';
import { DynamicSVGCustomizationFunctions } from '../DynamicSVG';
import { ThemeUtils, VehiclePart } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common';

type ReduceSelectedParts = Reducer<Array<VehiclePart>, { type: 'push' | 'pop'; part: VehiclePart }>;

function getOverlayAttributes(
  element: Parameters<NonNullable<DynamicSVGCustomizationFunctions['getAttributes']>>[0],
  groups: Parameters<NonNullable<DynamicSVGCustomizationFunctions['getAttributes']>>[1],
  selectedParts: Array<VehiclePart>,
  dispatchSelectedParts: Dispatch<ReducerAction<ReduceSelectedParts>>,
  utils: ThemeUtils,
): ReturnType<NonNullable<DynamicSVGCustomizationFunctions['getAttributes']>> {
  const style: CSSProperties = {};
  const otherProps: SVGProps<SVGElement> = { display: 'none' };
  const groupElement = groups[0];

  if (element.classList.contains('car-part')) {
    style['stroke'] = utils.getColor('text-primary');
    style['display'] = 'block';
  }
  // TODO: need to finalize the color for the selected parts.
  if (selectedParts.includes(element.id as VehiclePart)) style['fill'] = '#2196f3';

  if (element.classList.contains('selectable')) {
    style['pointerEvents'] = 'fill';
    style['cursor'] = 'pointer';
    otherProps['onClick'] = () => {
      const id = (element as SVGElement).id as VehiclePart;
      if (selectedParts.includes(id)) dispatchSelectedParts({ type: 'pop', part: id });
      else dispatchSelectedParts({ type: 'push', part: id });
    };
  }
  /**
   * Mainly to copy the style from the group element to the overlay element.
   * because class styles present in svg file prevent inheriting the styles from the parent.
   */
  if (groupElement) {
    const grpOverlayAttributes = getOverlayAttributes(
      groupElement,
      [],
      selectedParts,
      dispatchSelectedParts,
      utils,
    );
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

export function usePartsOverlay(
  partsAlreadySelected: Array<VehiclePart> = [],
): [Array<VehiclePart>, NonNullable<DynamicSVGCustomizationFunctions['getAttributes']>] {
  const reduceSelectedParts: ReduceSelectedParts = (
    state: Array<VehiclePart>,
    action: { type: 'push' | 'pop'; part: VehiclePart },
  ) => {
    switch (action.type) {
      case 'pop':
        return state.filter((i) => i !== action.part);
      case 'push':
        return [...state, action.part];
      default:
        return [] as never;
    }
  };
  const [selectedParts, dispatchSelectedParts] = useReducer(
    reduceSelectedParts,
    partsAlreadySelected,
  );
  const { utils } = useMonkTheme();
  return [
    selectedParts,
    (element, groups) =>
      getOverlayAttributes(element, groups, selectedParts, dispatchSelectedParts, utils),
  ];
}

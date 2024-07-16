import { PartSelectionOrientation, VehiclePart } from '@monkvision/types';
import { useMemo, useState } from 'react';

/**
 * To compile multiple events into a single event.
 *
 * with it own merge logic and emit the merged value.
 * NOTE: we can do if needed.
 */
export function useMergePartSelectionMultipleEvent(
  orientations: Array<PartSelectionOrientation>,
  partSelectionEvent: Function,
) {
  type Result = Array<VehiclePart>;
  const [orientationVsPartsSelected, setOrientationVsPartsSelected] = useState<
    Record<PartSelectionOrientation, Result>
  >(
    orientations.reduce((orientationVsParts, orientation) => {
      orientationVsParts[orientation] = [] as Result;
      return orientationVsParts;
    }, {} as Partial<Record<PartSelectionOrientation, Result>>) as Record<
      PartSelectionOrientation,
      Result
    >,
  );
  const calculatedValue = useMemo(() => {
    const mergedValue = Object.entries<Result>(orientationVsPartsSelected).reduce(
      (selectedPartsOfOrientation, [, selectedParts]) =>
        selectedParts.reduce((newSelectedParts, selectedPart) => {
          return newSelectedParts.includes(selectedPart)
            ? newSelectedParts
            : [...newSelectedParts, selectedPart];
        }, selectedPartsOfOrientation),
      [] as Result,
    );
    partSelectionEvent(mergedValue);
    return mergedValue;
  }, [orientationVsPartsSelected]);
  return [
    calculatedValue,
    (state: PartSelectionOrientation) => {
      return (value: Result) => {
        setOrientationVsPartsSelected({ ...orientationVsPartsSelected, [state]: value });
      };
    },
  ] as const;
}

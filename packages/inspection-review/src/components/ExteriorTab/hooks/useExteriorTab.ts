import { CSSProperties, SVGProps, useState } from 'react';
import { PartSelectionOrientation, TaskName, VehiclePart, VehicleType } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common/lib/theme/hooks';
import { useInspectionReviewProvider } from '../../../hooks/useInspectionReviewProvider';
import { useTabViews } from '../../../hooks/useTabViews';
import type { DamagedPartDetails, GalleryItem } from '../../../types';

/**
 * Enumeration of the different views available in the Exterior tab.
 */
export enum ExteriorViews {
  /**
   * The SVG car view where users can select parts.
   */
  SVGCar = 'SVG Car',
  /**
   * The view for viewing or editing damage details to a selected part.
   */
  AddPartDamage = 'Add Part Damage',
}

/**
 * State and handlers for the ExteriorTab component.
 */
export interface TabExteriorState {
  /**
   * The current view in the Exterior tab.
   */
  currentView: ExteriorViews;
  /**
   * The current orientation of the vehicle part selection.
   */
  orientation: PartSelectionOrientation;
  /**
   * The type of the vehicle.
   */
  vehicleType: VehicleType;
  /**
   * The list of vehicle parts that have been reviewed and validated by the user.
   */
  validatedParts: VehiclePart[];
  /**
   * Handler when the left orientation button is clicked.
   */
  onRotateLeft: () => void;
  /**
   * Handler when the right orientation button is clicked.
   */
  onRotateRight: () => void;
  /**
   * Handler when a vehicle part is clicked.
   */
  onPartClicked: (part: VehiclePart) => void;
  /**
   * Handler when the done button is clicked after viewing damage details of a part.
   */
  onDone: (partDetails: DamagedPartDetails) => void;
  /**
   * Handler to get SVG attributes for a vehicle part.
   */
  onGetPartAttributes: (part: VehiclePart) => SVGProps<SVGElement>;
  /**
   * Handler to reset the view to the list of parts.
   */
  onCancelDamage: () => void;
}

/**
 * Custom hook to manage the state and handlers for the ExteriorTab component.
 */
export function useExteriorTab(): TabExteriorState {
  const {
    onChangeSelectedExteriorPart,
    vehicleType,
    handleConfirmExteriorDamages,
    damagedPartsDetails,
    availablePricings,
    currentGalleryItems,
    setCurrentGalleryItems,
    resetSelectedItem,
  } = useInspectionReviewProvider();
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(ExteriorViews) });
  const { palette } = useMonkTheme();

  const [initialGalleryItems, setInitialGalleryItems] = useState<GalleryItem[]>([]);
  const [validatedParts, setValidatedParts] = useState<VehiclePart[]>([]);
  const [orientation, setOrientation] = useState<PartSelectionOrientation>(
    PartSelectionOrientation.FRONT_LEFT,
  );

  const handleRotateLeft = () => {
    const orientations = Object.values(PartSelectionOrientation);
    const currentOrientationIndex = orientations.findIndex((o) => o === orientation);
    const nextOrientation =
      orientations[currentOrientationIndex - 1] ?? orientations[orientations.length - 1];
    setOrientation(nextOrientation);
  };

  const handleRotateRight = () => {
    const orientations = Object.values(PartSelectionOrientation);
    const currentOrientationIndex = orientations.findIndex((o) => o === orientation);
    const nextOrientation = orientations[currentOrientationIndex + 1] ?? orientations[0];
    setOrientation(nextOrientation);
  };

  const handlePartClicked = (part: VehiclePart) => {
    setCurrentView(ExteriorViews.AddPartDamage);
    const damagedPart = damagedPartsDetails.find((d) => d.part === part);
    onChangeSelectedExteriorPart(
      damagedPart ?? { part, isDamaged: false, damageTypes: [], pricing: undefined },
    );

    if (initialGalleryItems.length === 0) {
      setInitialGalleryItems(currentGalleryItems);
    }

    const filteredGalleryItems = currentGalleryItems.filter((item) => {
      const isWheelAnalysis =
        item.sight?.tasks.includes(TaskName.WHEEL_ANALYSIS) &&
        String(item.sight?.wheelName) === String(part);
      const containsPart = item.parts?.some((p) => p.type === part);
      const centersOnPart = item.image.detailedViewpoint?.centersOn?.includes(part);

      if (isWheelAnalysis || containsPart || centersOnPart) {
        return true;
      }

      return false;
    });
    const partCloseUps = filteredGalleryItems.filter((item) => !item.sight);
    const sortedGalleryItemsWithoutCloseUps = [...filteredGalleryItems]
      .filter((item) => item.sight)
      .sort((a, b) => b.totalPolygonArea - a.totalPolygonArea);

    setCurrentGalleryItems([...partCloseUps, ...sortedGalleryItemsWithoutCloseUps]);
  };

  const updateValidatedParts = (part: VehiclePart) => {
    if (!validatedParts.includes(part)) {
      setValidatedParts([...validatedParts, part]);
    }
  };

  const resetToListView = () => {
    setCurrentGalleryItems(initialGalleryItems);
    setCurrentView(ExteriorViews.SVGCar);
    onChangeSelectedExteriorPart(null);
    resetSelectedItem();
  };

  const handleDone = (partDetails: DamagedPartDetails) => {
    handleConfirmExteriorDamages(partDetails);
    updateValidatedParts(partDetails.part);
    resetToListView();
  };

  const handlePartAttributes = (part: VehiclePart): SVGProps<SVGElement> => {
    const defaultStyles: CSSProperties = {
      stroke: palette.text.primary,
    };

    const detailedPart = damagedPartsDetails.find((d) => d.part === part);
    if (!detailedPart) {
      return { style: defaultStyles };
    }

    const needsPricing = detailedPart?.isDamaged && !detailedPart.pricing;
    let fillColor = 'none';

    if (needsPricing) {
      fillColor = 'lightgray';
    } else if (detailedPart?.isDamaged || detailedPart.pricing !== undefined) {
      Object.values(availablePricings).forEach((pricingValue) => {
        if (
          detailedPart.pricing !== undefined &&
          detailedPart.pricing >= pricingValue.min &&
          detailedPart.pricing < pricingValue.max
        ) {
          fillColor = pricingValue.color;
        }
      });
    }

    return {
      style: {
        ...defaultStyles,
        fill: fillColor,
      },
    };
  };

  return {
    currentView,
    orientation,
    vehicleType,
    validatedParts,
    onRotateLeft: handleRotateLeft,
    onRotateRight: handleRotateRight,
    onPartClicked: handlePartClicked,
    onDone: handleDone,
    onGetPartAttributes: handlePartAttributes,
    onCancelDamage: resetToListView,
  };
}

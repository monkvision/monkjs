import { SVGProps, useState } from 'react';
import { PartSelectionOrientation, VehiclePart, VehicleType } from '@monkvision/types';
import { useInspectionReviewProvider } from '../../hooks/InspectionReviewProvider';
import { useTabViews } from '../../hooks/useTabViews';
import { DamagedPartDetails, GalleryItem } from '../../types';

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
   * The currently selected damaged part details, or null if none is selected.
   */
  selectedPart: DamagedPartDetails | null;
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
    vehicleType,
    handleConfirmExteriorDamages,
    damagedPartsDetails,
    availablePricings,
    currentGalleryItems,
    setCurrentGalleryItems,
  } = useInspectionReviewProvider();
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(ExteriorViews) });

  const [initialGalleryItems, setInitialGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedPart, setSelectedPart] = useState<DamagedPartDetails | null>(null);
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
    setSelectedPart(damagedPart ?? { part, isDamaged: false, damageTypes: [], pricing: undefined });

    if (initialGalleryItems.length === 0) {
      setInitialGalleryItems(currentGalleryItems);
    }

    const filteredItems = currentGalleryItems.filter((item) =>
      item.parts?.some((p) => p.type === part),
    );
    const sortedItems = [...filteredItems].sort((a, b) => b.totalPolygonArea - a.totalPolygonArea);
    setCurrentGalleryItems(sortedItems);
  };

  const updateValidatedParts = (part: VehiclePart) => {
    if (!validatedParts.includes(part)) {
      setValidatedParts([...validatedParts, part]);
    }
  };

  const resetToListView = () => {
    setCurrentGalleryItems(initialGalleryItems);
    setCurrentView(ExteriorViews.SVGCar);
    setSelectedPart(null);
  };

  const handleDone = (partDetails: DamagedPartDetails) => {
    handleConfirmExteriorDamages(partDetails);
    updateValidatedParts(partDetails.part);
    resetToListView();
  };

  const handlePartAttributes = (part: VehiclePart) => {
    const detailedPart = damagedPartsDetails.find((d) => d.part === part);
    if (!detailedPart) {
      return {};
    }

    const needsPricing = detailedPart?.isDamaged && !detailedPart.pricing;
    let fillColor = 'none';

    if (needsPricing) {
      fillColor = 'gray';
    } else if (detailedPart?.isDamaged) {
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
        fill: fillColor,
      },
    };
  };

  return {
    currentView,
    selectedPart,
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

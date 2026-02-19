import { useState } from 'react';
import { PartSelectionOrientation, VehiclePart, VehicleType } from '@monkvision/types';
import { useInspectionReviewState } from '../../../hooks/InspectionReviewProvider';
import { useTabViews } from '../../../hooks/useTabViews';
import { DamagedPartDetails } from '../../../types';

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
   * Handler when the left orientation button is clicked.
   */
  handleLeftClick: () => void;
  /**
   * Handler when the right orientation button is clicked.
   */
  handleRightClick: () => void;
  /**
   * Handler when a vehicle part is clicked.
   */
  handlePartClicked: (part: VehiclePart) => void;
  /**
   * Handler when the done button is clicked after viewing damage details of a part.
   */
  handleDone: (partDetails: DamagedPartDetails) => void;
  /**
   * Handler to reset the view to the list of parts.
   */
  resetToListView: () => void;
}

/**
 * Custom hook to manage the state and handlers for the ExteriorTab component.
 */
export function useExteriorTab() {
  const { vehicleTypes, handleConfirmExteriorDamages, damagedPartsDetails } =
    useInspectionReviewState();
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(ExteriorViews) });
  const [selectedPart, setSelectedPart] = useState<DamagedPartDetails | null>(null);
  const [orientation, setOrientation] = useState<PartSelectionOrientation>(
    PartSelectionOrientation.FRONT_LEFT,
  );

  const handleLeftClick = () => {
    const orientations = Object.values(PartSelectionOrientation);
    const currentOrientationIndex = orientations.findIndex((o) => o === orientation);
    const nextOrientation =
      orientations[currentOrientationIndex - 1] ?? orientations[orientations.length - 1];
    setOrientation(nextOrientation);
  };

  const handleRightClick = () => {
    const orientations = Object.values(PartSelectionOrientation);
    const currentOrientationIndex = orientations.findIndex((o) => o === orientation);
    const nextOrientation = orientations[currentOrientationIndex + 1] ?? orientations[0];
    setOrientation(nextOrientation);
  };

  const handlePartClicked = (part: VehiclePart) => {
    setCurrentView(ExteriorViews.AddPartDamage);
    const damagedPart = damagedPartsDetails.find((d) => d.part === part);
    setSelectedPart(damagedPart ?? { part, isDamaged: false, damageTypes: [], pricing: undefined });
  };

  const resetToListView = () => {
    setCurrentView(ExteriorViews.SVGCar);
    setSelectedPart(null);
  };

  const handleDone = (partDetails: DamagedPartDetails) => {
    handleConfirmExteriorDamages(partDetails);
    resetToListView();
  };

  return {
    currentView,
    selectedPart,
    orientation,
    vehicleType: vehicleTypes[0],
    handleLeftClick,
    handleRightClick,
    handlePartClicked,
    handleDone,
    resetToListView,
  };
}

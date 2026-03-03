import { VehicleDynamicWireframe } from '@monkvision/common-ui-web';
import { useInspectionReviewState, useTabViews } from '../hooks';
import { useState } from 'react';
import { PartSelectionOrientation, VehiclePart } from '@monkvision/types';
import { AddExteriorDamage } from './AddExteriorDamage';
import { PricingRow } from './PricingRow';
import { DamagedPartDetails } from '../types/damage.types';

enum ExteriorViews {
  SVGCar = 'SVG Car',
  AddPartDamage = 'Add Part Damage',
}

/**
 * The ExteriorTab component that displays content based on the currently active tab.
 */
export function ExteriorTab() {
  const { vehicleTypes, handleConfirmExteriorDamages, damagedPartsDetails } =
    useInspectionReviewState();
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(ExteriorViews) });
  const [orientation, setOrientation] = useState<PartSelectionOrientation>(
    PartSelectionOrientation.FRONT_LEFT,
  );
  const [selectedPart, setSelectedPart] = useState<DamagedPartDetails | null>(null);

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
    setSelectedPart(damagedPartsDetails.find((d) => d.part === part) ?? null);
  };

  const handleDone = (partDetails: DamagedPartDetails) => {
    handleConfirmExteriorDamages(partDetails);
    resetToListView();
  };

  const resetToListView = () => {
    setCurrentView(ExteriorViews.SVGCar);
    setSelectedPart(null);
  };

  if (currentView === ExteriorViews.SVGCar)
    return (
      <div>
        <div style={{ backgroundColor: 'black' }}>
          <VehicleDynamicWireframe
            vehicleType={vehicleTypes[0]}
            orientation={orientation}
            onClickPart={handlePartClicked}
          />
          <div>
            <button onClick={handleLeftClick}>Left</button>
            <button onClick={handleRightClick}>Right</button>
          </div>
        </div>

        <PricingRow />
      </div>
    );

  return (
    <AddExteriorDamage
      detailedPart={selectedPart!}
      handleDone={handleDone}
      handleCancel={resetToListView}
    />
  );
}

import { VehicleDynamicWireframe } from '@monkvision/common-ui-web';
import { useInspectionReviewState, useTabViews } from '../hooks';
import { useState } from 'react';
import { PartSelectionOrientation, VehiclePart } from '@monkvision/types';
import { PricesRow } from './PricingRow/PricesRow';

enum ExteriorViews {
  SVGCar = 'SVG Car',
  AddPartDamage = 'Add Part Damage',
}

/**
 * The ExteriorTab component that displays content based on the currently active tab.
 */
export function ExteriorTab() {
  const { vehicleTypes } = useInspectionReviewState();
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(ExteriorViews) });
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
    console.log('Part clicked:', part);
    setCurrentView(ExteriorViews.AddPartDamage);
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

        <PricesRow />
      </div>
    );

  return (
    <div>
      <p>Active Tab Content is Exterior</p>
      <div>Adding a New Damage</div>
      <button onClick={() => setCurrentView(ExteriorViews.SVGCar)}>Back to Damages List</button>
    </div>
  );
}

import { VehicleDynamicWireframe } from '@monkvision/common-ui-web';
import { AddExteriorDamage } from './AddExteriorDamage';
import { Pricings } from './Pricings';
import { ExteriorViews, useExteriorTab } from './AddExteriorDamage/hooks/useExteriorTab';

/**
 * The ExteriorTab component that displays content based on the currently active tab.
 */
export function ExteriorTab() {
  const {
    currentView,
    selectedPart,
    orientation,
    vehicleType,
    handleLeftClick,
    handleRightClick,
    handlePartClicked,
    handleDone,
    resetToListView,
  } = useExteriorTab();

  if (currentView === ExteriorViews.SVGCar) {
    return (
      <div>
        <div style={{ backgroundColor: 'black' }}>
          <VehicleDynamicWireframe
            vehicleType={vehicleType}
            orientation={orientation}
            onClickPart={handlePartClicked}
          />
          <div>
            <button onClick={handleLeftClick}>Left</button>
            <button onClick={handleRightClick}>Right</button>
          </div>
        </div>

        <Pricings />
      </div>
    );
  }

  return (
    <AddExteriorDamage
      detailedPart={selectedPart}
      handleDone={handleDone}
      handleCancel={resetToListView}
    />
  );
}

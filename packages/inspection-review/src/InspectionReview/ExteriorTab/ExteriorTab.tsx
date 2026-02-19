import { Icon, VehicleDynamicWireframe } from '@monkvision/common-ui-web';
import { AddExteriorDamage } from './AddExteriorDamage';
import { Pricings } from './Pricings';
import { ExteriorViews, useExteriorTab } from './hooks/useExteriorTab';
import { styles } from './ExteriorTab.styles';

/**
 * The ExteriorTab component that displays content based on the currently active tab.
 */
export function ExteriorTab() {
  const {
    currentView,
    selectedPart,
    orientation,
    vehicleType,
    handleRotateLeft,
    handleRotateRight,
    handlePartClicked,
    handleDone,
    handlePartAttributes,
    resetToListView,
  } = useExteriorTab();

  if (currentView === ExteriorViews.SVGCar) {
    return (
      <div>
        <div>
          <VehicleDynamicWireframe
            vehicleType={vehicleType}
            orientation={orientation}
            onClickPart={handlePartClicked}
            getPartAttributes={handlePartAttributes}
          />
          <div style={styles['rotationIconsContainer']}>
            <Icon
              icon='rotate-left'
              primaryColor='text-primary'
              onClick={handleRotateLeft}
              size={50}
            />
            <Icon
              icon='rotate-right'
              primaryColor='text-primary'
              onClick={handleRotateRight}
              size={50}
            />
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

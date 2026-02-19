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
    validatedParts,
    onRotateLeft,
    onRotateRight,
    onPartClicked,
    onDone,
    onGetPartAttributes,
    onCancelDamage,
  } = useExteriorTab();

  if (currentView === ExteriorViews.SVGCar) {
    return (
      <>
        <div style={styles['vehicleWireframeContainer']}>
          <VehicleDynamicWireframe
            vehicleType={vehicleType}
            orientation={orientation}
            onClickPart={onPartClicked}
            getPartAttributes={onGetPartAttributes}
            validatedParts={validatedParts}
          />
          <div style={styles['rotationIconsContainer']}>
            <Icon icon='rotate-left' primaryColor='text-primary' onClick={onRotateLeft} size={50} />
            <Icon
              icon='rotate-right'
              primaryColor='text-primary'
              onClick={onRotateRight}
              size={50}
            />
          </div>
        </div>

        <Pricings />
      </>
    );
  }

  return (
    <AddExteriorDamage
      selectedPart={selectedPart}
      onDone={onDone}
      onCancelDamage={onCancelDamage}
    />
  );
}

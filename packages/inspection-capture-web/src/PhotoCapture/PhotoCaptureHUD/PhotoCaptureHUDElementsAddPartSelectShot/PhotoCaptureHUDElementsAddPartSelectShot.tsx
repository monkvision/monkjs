import { getLanguage, useMonkAppState, useMonkTheme, vehiclePartLabels } from '@monkvision/common';
import { Button, VehiclePartSelection } from '@monkvision/common-ui-web';
import { VehiclePart } from '@monkvision/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhotoCaptureHUDElementsAddPartSelectShotStyle } from './usePhotoCaptureHUDElementsAddPartSelectShotStyle';

export function PhotoCaptureHUDElementsAddPartSelectShot({ onCancel }: { onCancel: () => void }) {
  const { vehicleType } = useMonkAppState();
  const { palette } = useMonkTheme();
  const [selectedParts, setSelectedParts] = useState<VehiclePart[]>([]);
  const { i18n } = useTranslation();
  const style = usePhotoCaptureHUDElementsAddPartSelectShotStyle();

  return (
    <div style={style.stackItem}>
      <Button
        style={style.closeButton}
        icon='close'
        primaryColor={palette.background.dark}
        onClick={onCancel}
      />
      <div style={style.wrapper}>
        <div
          style={{
            ...style.infoNotification,
            ...style.notification,
          }}
        >
          Please select the parts you want to capture
        </div>
        <VehiclePartSelection vehicleType={vehicleType!} onPartsSelected={setSelectedParts} />
        {selectedParts.length !== 0 && (
          <div
            data-testid='part-select-notification'
            style={{
              ...style.partSelectNotification,
              ...style.notification,
            }}
          >
            {selectedParts
              .map((part) => vehiclePartLabels[part][getLanguage(i18n.language)])
              .join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}

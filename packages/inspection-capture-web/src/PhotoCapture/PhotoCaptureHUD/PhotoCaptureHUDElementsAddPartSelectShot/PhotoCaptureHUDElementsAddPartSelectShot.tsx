import { getLanguage, useMonkAppState, useMonkTheme, vehiclePartLabels } from '@monkvision/common';
import { Button, VehiclePartSelection } from '@monkvision/common-ui-web';
import { VehiclePart } from '@monkvision/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoCaptureHUDElementsProps } from '../PhotoCaptureHUDElements/PhotoCaptureHUDElements.model';
import { usePhotoCaptureHUDElementsAddPartSelectShotStyle } from './usePhotoCaptureHUDElementsAddPartSelectShotStyle';

type PhotoCaptureHUDElementsAddPartSelectShotProps = Pick<
  PhotoCaptureHUDElementsProps,
  'onAddDamageParts'
> & {
  onCancel: PhotoCaptureHUDElementsProps['onCancelAddDamage'];
  partSelectState: PhotoCaptureHUDElementsProps['addDamagePartSelectState'];
};
export function PhotoCaptureHUDElementsAddPartSelectShot({
  onCancel,
  onAddDamageParts,
  partSelectState,
}: PhotoCaptureHUDElementsAddPartSelectShotProps) {
  const { vehicleType } = useMonkAppState();
  const { palette } = useMonkTheme();
  const [selectedParts, setSelectedParts] = useState<VehiclePart[]>([]);
  const { i18n, t } = useTranslation();
  const style = usePhotoCaptureHUDElementsAddPartSelectShotStyle();
  useEffect(() => onAddDamageParts(selectedParts), [selectedParts]);
  if (partSelectState === 'image-capture') {
    return null;
  }
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
          {t('photo.hud.addDamage.selectParts')}
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

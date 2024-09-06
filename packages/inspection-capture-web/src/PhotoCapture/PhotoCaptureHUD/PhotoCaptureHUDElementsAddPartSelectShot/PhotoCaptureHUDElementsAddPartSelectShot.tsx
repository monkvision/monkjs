import { getLanguage, useMonkAppState, useMonkTheme, vehiclePartLabels } from '@monkvision/common';
import { BackdropDialog, Button, VehiclePartSelection } from '@monkvision/common-ui-web';
import { VehiclePart } from '@monkvision/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoCaptureHUDElementsProps } from '../PhotoCaptureHUDElements/PhotoCaptureHUDElements.model';
import { usePhotoCaptureHUDElementsAddPartSelectShotStyle } from './usePhotoCaptureHUDElementsAddPartSelectShotStyle';

export type PhotoCaptureHUDElementsAddPartSelectShotProps = Pick<
  PhotoCaptureHUDElementsProps,
  'onAddDamageParts'
> & {
  /**
   * Callback called when the user cancels the Add Damage mode.
   */
  onCancel: PhotoCaptureHUDElementsProps['onCancelAddDamage'];
};

export function PhotoCaptureHUDElementsAddPartSelectShot({
  onCancel,
  onAddDamageParts,
}: PhotoCaptureHUDElementsAddPartSelectShotProps) {
  const { vehicleType } = useMonkAppState();
  const { palette } = useMonkTheme();
  const [selectedParts, setSelectedParts] = useState<VehiclePart[]>([]);
  const { i18n, t } = useTranslation();
  const style = usePhotoCaptureHUDElementsAddPartSelectShotStyle();
  const [showDialog, setShowDialog] = useState(true);
  const closeDialog = () => {
    setShowDialog(false);
    onCancel();
  };
  const acceptDialog = () => {
    setShowDialog(false);
    onAddDamageParts(selectedParts);
  };
  return (
    <BackdropDialog
      show={showDialog}
      dialog={
        <div style={style.popup}>
          {t('photo.hud.addDamage.selectParts')}
          <span style={style.vehicleSelect}>
            <VehiclePartSelection vehicleType={vehicleType!} onPartsSelected={setSelectedParts} />
          </span>
          {selectedParts
            .map((part) => vehiclePartLabels[part][getLanguage(i18n.language)])
            .join(', ')}
          <span style={style.dialogButtonGroup}>
            <Button
              primaryColor={palette.background.dark}
              onClick={acceptDialog}
              style={style.button}
            >
              {t('photo.hud.addDamage.accept')}
            </Button>
            <Button
              primaryColor={palette.background.dark}
              onClick={closeDialog}
              style={style.button}
            >
              {t('photo.hud.addDamage.cancel')}
            </Button>
          </span>
        </div>
      }
    />
  );
}

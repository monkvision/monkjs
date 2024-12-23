import { useMonkAppState, useMonkTheme, vehiclePartLabels, getLanguage } from '@monkvision/common';
import { BackdropDialog, VehiclePartSelection, Button } from '@monkvision/common-ui-web';
import { VehiclePart } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { usePhotoCaptureHUDElementsAddDamagePartSelectShotStyle } from './hooks';
import { PhotoCaptureHUDElementsAddDamage2ndShot } from '../PhotoCaptureHUDElementsAddDamage2ndShot';

export interface PhotoCaptureHUDElementsAddDamagePartSelectShotProps {
  /**
   * Current vehicle parts selected to take a picture of.
   */
  vehicleParts: VehiclePart[];
  /**
   * Boolean indicating if the vehicle part selector is currently displayed.
   */
  showVehiclePartSelector: boolean;
  /**
   * Callback called when the user cancels the Add Damage mode.
   */
  onCancel?: () => void;
  /**
   * Callback called when the user selects the parts to take a picture of.
   */
  onAddDamagePartsSelected?: (parts: VehiclePart[]) => void;
  /**
   * Callback called when the user clicks on the "Validate" button of the Add Damage mode.
   */
  onValidateVehicleParts?: () => void;
}

export function PhotoCaptureHUDElementsAddDamagePartSelectShot({
  vehicleParts,
  showVehiclePartSelector,
  onCancel = () => {},
  onAddDamagePartsSelected = () => {},
  onValidateVehicleParts = () => {},
}: PhotoCaptureHUDElementsAddDamagePartSelectShotProps) {
  const { vehicleType } = useMonkAppState();
  const { palette } = useMonkTheme();
  const { i18n, t } = useTranslation();
  const style = usePhotoCaptureHUDElementsAddDamagePartSelectShotStyle();

  const closeDialog = () => {
    onCancel();
  };

  const acceptDialog = () => {
    onValidateVehicleParts();
    onAddDamagePartsSelected(vehicleParts);
  };

  if (!vehicleType) {
    throw new Error('Vehicle type state is not found from useMonkAppState');
  }

  return (
    <>
      {!showVehiclePartSelector && (
        <PhotoCaptureHUDElementsAddDamage2ndShot onCancel={onCancel} showCounter={false} />
      )}

      <BackdropDialog
        show={showVehiclePartSelector}
        dialog={
          <div style={style.popup}>
            <Button
              primaryColor={palette.background.dark}
              onClick={closeDialog}
              style={style.closeBtn}
              icon='close'
            />
            <Button
              primaryColor={vehicleParts.length ? palette.primary.base : palette.text.disabled}
              onClick={acceptDialog}
              style={style.validateBtn}
              disabled={vehicleParts.length === 0}
              icon='check'
            />
            <span style={style.vehicleSelect}>
              <VehiclePartSelection
                vehicleType={vehicleType}
                onPartsSelected={onAddDamagePartsSelected}
              />
            </span>
            <div style={style.labelsContainer}>
              <Button
                primaryColor={palette.text.white}
                secondaryColor={palette.text.black}
                style={style.tutoLabel}
              >
                {t('photo.hud.addDamage.selectParts')}
              </Button>
              {vehicleParts.length > 0 && (
                <span style={style.partsLabel}>
                  <Button primaryColor={palette.text.white} secondaryColor={palette.text.black}>
                    {vehicleParts
                      .map((part) => vehiclePartLabels[part][getLanguage(i18n.language)])
                      .join(', ')}
                  </Button>
                </span>
              )}
            </div>
          </div>
        }
      />
    </>
  );
}

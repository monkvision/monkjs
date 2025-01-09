import { useMonkAppState, useMonkTheme, vehiclePartLabels, getLanguage } from '@monkvision/common';
import { VehiclePartSelection, Button } from '@monkvision/common-ui-web';
import { VehiclePart } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { styles } from './PartSelection.styles';
import { useColorBackground } from '../../hooks';

/**
 * Props of PartSelection component.
 */
export interface PartSelectionProps {
  /**
   * Current vehicle parts selected to take a picture of.
   */
  vehicleParts: VehiclePart[];
  /**
   * Boolean indicating if the vehicle part selector is currently displayed.
   */
  disabled?: boolean;
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
  /**
   * The maximum number of parts that can be selected.
   */
  maxSelectableParts?: number;
}

/**
 * Component that displays a vehicle wireframe on top of the Camera Preview that is used
 * to select the parts of the vehicle that the user wants to take a picture of.
 */
export function PartSelection({
  vehicleParts,
  disabled = false,
  onCancel = () => {},
  onAddDamagePartsSelected = () => {},
  onValidateVehicleParts = () => {},
  maxSelectableParts = 1,
}: PartSelectionProps) {
  const { vehicleType } = useMonkAppState();
  const { palette } = useMonkTheme();
  const { i18n, t } = useTranslation();
  const backgroundColor = useColorBackground(0.9);
  const buttonColor = useColorBackground();

  if (!vehicleType) {
    throw new Error('Vehicle type state is not found from useMonkAppState');
  }
  const instruction =
    maxSelectableParts === 1 ? 'photo.hud.addDamage.selectPart' : 'photo.hud.addDamage.selectParts';

  return disabled ? null : (
    <div style={{ ...styles['container'], background: backgroundColor }}>
      <div style={styles['vehicleSelect']}>
        <VehiclePartSelection
          vehicleType={vehicleType}
          maxSelectableParts={maxSelectableParts}
          onPartsSelected={onAddDamagePartsSelected}
        />
      </div>
      <Button
        primaryColor={buttonColor}
        onClick={onCancel}
        style={styles['closeBtn']}
        icon='close'
      />
      <Button
        primaryColor={vehicleParts.length ? palette.primary.base : palette.text.disabled}
        onClick={onValidateVehicleParts}
        style={styles['validateBtn']}
        disabled={vehicleParts.length === 0}
        icon='check'
      />
      <div style={styles['labelsContainer']}>
        <div>
          <Button
            primaryColor={palette.text.white}
            secondaryColor={palette.text.black}
            style={styles['tutoLabel']}
          >
            {t(instruction)}
          </Button>
        </div>
        {vehicleParts.length > 0 && (
          <span style={styles['partsLabel']}>
            <Button primaryColor={palette.text.white} secondaryColor={palette.text.black}>
              {vehicleParts
                .map((part) => vehiclePartLabels[part][getLanguage(i18n.language)])
                .join(', ')}
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}

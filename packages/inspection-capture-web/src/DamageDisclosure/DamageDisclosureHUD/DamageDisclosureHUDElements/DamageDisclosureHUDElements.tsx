import { CaptureAppConfig, PixelDimensions, VehiclePart } from '@monkvision/types';
import { CaptureMode } from '../../../types';
import { CloseUpShot, PartSelection, ZoomOutShot } from '../../../components';
/**
 * Props of the DamageDisclosureHUDElements component.
 */
export interface DamageDisclosureHUDElementsProps extends Pick<CaptureAppConfig, 'addDamage'> {
  /**
   * The current mode of the component.
   */
  mode: CaptureMode;
  /**
   * Current vehicle parts selected to take a picture of.
   */
  vehicleParts: VehiclePart[];
  /**
   * Callback called when the user presses the Add Damage button.
   */
  onAddDamage: () => void;
  /**
   * Callback called when the user selects the parts to take a picture of.
   */
  onAddDamagePartsSelected?: (parts: VehiclePart[]) => void;
  /**
   * Callback called when the user cancels the Add Damage mode.
   */
  onCancelAddDamage: () => void;
  /**
   * Callback called when the user clicks on the "Validate" button of the Add Damage mode.
   */
  onValidateVehicleParts: () => void;
  /**
   * The effective pixel dimensions of the Camera video stream on the screen.
   */
  previewDimensions: PixelDimensions | null;
  /**
   * Boolean indicating if the global loading state of the DamageDisclosure component is loading or not.
   */
  isLoading?: boolean;
  /**
   * The error that occurred in the DamageDisclosure component. Set this value to `null` if there is no error.
   */
  error?: unknown | null;
}

/**
 * Component implementing an HUD displayed on top of the Camera preview during the DamageDisclosure process.
 */
export function DamageDisclosureHUDElements(params: DamageDisclosureHUDElementsProps) {
  if (params.isLoading || !!params.error) {
    return null;
  }
  if (params.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT) {
    return <ZoomOutShot onCancel={params.onCancelAddDamage} />;
  }
  if (
    [CaptureMode.ADD_DAMAGE_2ND_SHOT, CaptureMode.ADD_DAMAGE_PART_SELECT_SHOT].includes(params.mode)
  ) {
    return (
      <CloseUpShot
        onCancel={params.onCancelAddDamage}
        streamDimensions={params.previewDimensions}
        showCounter={params.mode === CaptureMode.ADD_DAMAGE_2ND_SHOT}
      />
    );
  }
  return (
    <PartSelection
      onCancel={params.onCancelAddDamage}
      vehicleParts={params.vehicleParts}
      onValidateVehicleParts={params.onValidateVehicleParts}
      onAddDamagePartsSelected={params.onAddDamagePartsSelected}
    />
  );
}

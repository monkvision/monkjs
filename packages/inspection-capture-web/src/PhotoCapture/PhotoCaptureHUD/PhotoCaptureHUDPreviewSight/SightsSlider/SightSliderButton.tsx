import { Button } from '@monkvision/common-ui-web';
import { styles } from './SightsSlider.styles';

/**
 * Props of the SightSliderButton component.
 */
export interface SightSliderButtonProps {
  /**
   * The label of the sight, already translated.
   */
  label?: string;
  /**
   * Boolean indicating if the sight of the button is currently selected or not.
   */
  isSelected?: boolean;
  /**
   * Boolean indicating if the sight of the button has already been taken or not.
   */
  isTaken?: boolean;
  /**
   * Callback called when the user clicks on the button.
   */
  onClick?: () => void;
}

/**
 * Button representing a sight in the PhotoCapture SightsSlider component.
 */
export function SightSliderButton({ label, isSelected, isTaken, onClick }: SightSliderButtonProps) {
  const primaryColor = isSelected || isTaken ? 'primary-base' : 'secondary-xdark';
  const icon = isTaken ? 'check' : undefined;

  return (
    <Button
      style={styles['button']}
      icon={icon}
      primaryColor={primaryColor}
      onClick={onClick}
      disabled={isTaken}
    >
      {label}
    </Button>
  );
}

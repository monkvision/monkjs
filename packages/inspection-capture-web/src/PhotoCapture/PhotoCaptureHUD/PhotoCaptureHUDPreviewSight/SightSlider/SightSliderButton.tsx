import { Button, IconName } from '@monkvision/common-ui-web';
import { ImageStatus } from '@monkvision/types';
import { styles } from './SightSlider.styles';

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
   * The status of the image taken for the sight. If no image has been taken, this value must not be defined.
   */
  status?: ImageStatus | null;
  /**
   * Callback called when the user clicks on the button.
   */
  onClick?: () => void;
}

function useSliderStyle({
  isSelected,
  status,
}: Pick<SightSliderButtonProps, 'isSelected' | 'status'>) {
  const sliderStyle = {
    primaryColor: 'background-base',
    disabled: [ImageStatus.COMPLIANCE_RUNNING, ImageStatus.UPLOADING, ImageStatus.SUCCESS].includes(
      status as ImageStatus,
    ),
    icon: undefined as IconName | undefined,
  };
  switch (status) {
    case ImageStatus.UPLOADING:
      sliderStyle.icon = 'processing';
      break;
    case ImageStatus.COMPLIANCE_RUNNING:
      sliderStyle.icon = 'processing';
      break;
    case ImageStatus.SUCCESS:
      sliderStyle.primaryColor = 'primary';
      sliderStyle.icon = 'check-circle';
      break;
    case ImageStatus.UPLOAD_FAILED:
      sliderStyle.primaryColor = 'alert';
      sliderStyle.icon = 'error';
      break;
    case ImageStatus.NOT_COMPLIANT:
      sliderStyle.primaryColor = 'alert';
      sliderStyle.icon = 'error';
      break;
    default:
      break;
  }
  if (isSelected) {
    sliderStyle.primaryColor = 'primary';
  }
  return sliderStyle;
}

/**
 * Button representing a sight in the PhotoCapture SightSlider component.
 */
export function SightSliderButton({ label, isSelected, status, onClick }: SightSliderButtonProps) {
  const { primaryColor, disabled, icon } = useSliderStyle({ isSelected, status });

  return (
    <Button
      style={styles['button']}
      icon={icon}
      primaryColor={primaryColor}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}

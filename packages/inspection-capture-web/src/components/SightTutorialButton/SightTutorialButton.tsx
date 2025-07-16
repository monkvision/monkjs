import { Button, Icon } from '@monkvision/common-ui-web';
import { ButtonHTMLAttributes } from 'react';
import { styles } from './SightTutorialButton.styles';

/**
 * Props of the SightTutorialButton component.
 */
export interface SightTutorialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Callback called when the user clicks on the "help" button in PhotoCapture.
   */
  toggleSightTutorial?: () => void;
}

/**
 * Component implementing a cancel button displayed in the Camera HUD.
 */
export function SightTutorialButton({
  toggleSightTutorial,
  ...passThroughProps
}: SightTutorialButtonProps) {
  return (
    <Button
      variant='text'
      onClick={toggleSightTutorial}
      style={styles['sightTutorialButton']}
      {...passThroughProps}
    >
      <Icon size={50} icon='help-outline' primaryColor='text-primary' />
    </Button>
  );
}

import { PropsWithChildren } from 'react';
import { Button } from '../Button';
import { styles } from './FullscreenModal.styles';

/**
 * Props that can be passed to the Fullscreen Modal component.
 */
export interface FullscreenModalProps {
  /**
   * Boolean indicating if the modal is shown or not.
   */
  show?: boolean;
  /**
   * Callback function invoked when the modal is closed.
   */
  onClose?: () => void;
  /**
   * Optional title for the modal.
   */
  title?: string;
}

/**
 * Component used to display a full screen modal on top of the screen. The content of the modal must be passed as
 * children to this component.
 */
export function FullscreenModal({
  show = false,
  onClose,
  title = '',
  children,
}: PropsWithChildren<FullscreenModalProps>) {
  return show ? (
    <div style={styles['container']} data-testid='container'>
      <div style={styles['content']}> {children}</div>
      <div style={styles['title']}>{title}</div>
      <Button
        style={styles['closeButton']}
        icon='close'
        variant='text'
        primaryColor='text-white'
        onClick={onClose}
      />
    </div>
  ) : null;
}

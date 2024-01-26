import { JSX } from 'react';
import { Button } from '../Button';
import { styles } from './FullscreenModal.styles';

/**
 * Props that can be passed to the Fullscreen Modal component.
 */
export interface FullscreenModalProps {
  show: boolean;
  onClose?: () => void;
  title?: string;
  children?: string | JSX.Element | JSX.Element[];
}

/**
 * Generic Fullscreen Modal component used to display a full screen modal on top of the screen.
 */
export function FullscreenModal({ show, onClose, title = '', children }: FullscreenModalProps) {
  return show ? (
    <div style={styles['container']} data-testid='container'>
      <div style={styles['content']}> {children}</div>
      <div style={styles['title']}>{title}</div>
      <Button
        style={styles['closeButton']}
        icon='close'
        variant='text'
        primaryColor={'text-white'}
        onClick={onClose}
      />
    </div>
  ) : null;
}

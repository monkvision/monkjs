import { ButtonHTMLAttributes } from 'react';

/**
 * Additional props that can be passed to the RecordVideoButton component.
 */
export interface MonkRecordVideoButtonProps {
  /**
   * This size includes the center circle + the outer rim, not just the circle at the middle.
   *
   * @default 80
   */
  size?: number;
  /**
   * Boolean indicating if the user is currently recording a video or not.
   */
  isRecording?: boolean;
  /**
   * Optional tooltip that will be displayed around the button.
   */
  tooltip?: string;
  /**
   * The position of the tooltip around the button.
   *
   * @default 'up'
   */
  tooltipPosition?: 'up' | 'down' | 'right' | 'left';
  /**
   * Callback called when the user clicks on the button.
   */
  onClick?: () => void;
}

/**
 * Props that the TakePictureButton component can accept.
 */
export type RecordVideoButtonProps = MonkRecordVideoButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

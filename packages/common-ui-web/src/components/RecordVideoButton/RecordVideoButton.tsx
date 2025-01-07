import { forwardRef } from 'react';
import { useInteractiveStatus } from '@monkvision/common';
import { useRecordVideoButtonStyles } from './RecordVideoButton.styles';
import { RecordVideoButtonProps } from './RecordVideoButton.types';

/**
 * Button used on the VideoCapture component, displayed on top of the camera preview to allow the user to record a
 * video.
 */
export const RecordVideoButton = forwardRef<HTMLButtonElement, RecordVideoButtonProps>(
  function RecordVideoButton(
    {
      size = 80,
      isRecording = false,
      disabled = false,
      tooltip,
      tooltipPosition = 'up',
      style = {},
      onClick,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...passThroughProps
    },
    ref,
  ) {
    const { status, eventHandlers } = useInteractiveStatus({
      disabled,
      componentHandlers: {
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
      },
    });
    const { container, innerCircle, tooltipContainer, tooltipArrow } = useRecordVideoButtonStyles({
      size,
      isRecording,
      status,
      tooltipPosition,
    });

    return (
      <button
        ref={ref}
        style={{ ...container, ...style }}
        onClick={onClick}
        disabled={disabled}
        {...eventHandlers}
        {...passThroughProps}
        data-testid='record-video-button'
      >
        {tooltip && <span style={tooltipContainer}>{tooltip}</span>}
        {tooltip && <span style={tooltipArrow}></span>}
        <span style={innerCircle}></span>
      </button>
    );
  },
);

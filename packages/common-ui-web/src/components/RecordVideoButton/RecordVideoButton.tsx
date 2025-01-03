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
    const { container, innerCircle } = useRecordVideoButtonStyles({ size, isRecording, status });

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
        <span style={innerCircle}></span>
      </button>
    );
  },
);

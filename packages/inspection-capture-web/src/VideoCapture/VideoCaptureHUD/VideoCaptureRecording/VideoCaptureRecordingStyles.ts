import { Styles } from '@monkvision/types';
import { useIsMounted, useResponsiveStyle } from '@monkvision/common';
import { useState } from 'react';
import { VideoCaptureRecordingProps } from './VideoCaptureRecording.types';

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  containerLandscape: {
    __media: { landscape: true },
    flexDirection: 'row',
  },
  controls: {
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: '0 20px 32px 20px',
  },
  controlsLandscape: {
    __media: { landscape: true },
    flexDirection: 'column-reverse',
    padding: '20px 32px 20px 0',
  },
  walkaroundIndicatorDisabled: {
    opacity: 0.7,
    filter: 'grayscale(1)',
  },
  takePictureFlash: {
    position: 'fixed',
    inset: '0 0 0 0',
    zIndex: 999,
    backgroundColor: '#efefef',
    opacity: 0,
    transition: 'opacity 0.5s ease-out',
    pointerEvents: 'none',
  },
  takePictureFlashVisible: {
    opacity: 1,
    transition: 'none',
  },
};

export function useVideoCaptureRecordingStyles({
  isRecording,
}: Pick<VideoCaptureRecordingProps, 'isRecording'>) {
  const [isTakePictureFlashVisible, setTakePictureFlashVisible] = useState(false);
  const { responsive } = useResponsiveStyle();
  const isMounted = useIsMounted();

  const showTakePictureFlash = () => {
    setTakePictureFlashVisible(true);
    setTimeout(() => {
      if (isMounted()) {
        setTakePictureFlashVisible(false);
      }
    }, 100);
  };

  return {
    container: {
      ...styles['container'],
      ...responsive(styles['containerLandscape']),
    },
    controls: {
      ...styles['controls'],
      ...responsive(styles['controlsLandscape']),
    },
    takePictureFlash: {
      ...styles['takePictureFlash'],
      ...(isTakePictureFlashVisible ? styles['takePictureFlashVisible'] : {}),
    },
    walkaroundIndicator: {
      ...(isRecording ? {} : styles['walkaroundIndicatorDisabled']),
    },
    showTakePictureFlash,
  };
}

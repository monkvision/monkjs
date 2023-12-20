import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDPreview.styles';

export interface PhotoCaptureHUDPreview {
  containerStyle: CSSProperties;
  top: CSSProperties;
  counter: CSSProperties;
  slider: CSSProperties;
  labelButton: CSSProperties;
  sightOverlay: CSSProperties;
}

export function usePhotoCaptureHUDPreview(): PhotoCaptureHUDPreview {
  const { responsive } = useResponsiveStyle();
  return {
    containerStyle: {
      ...styles['container'],
      ...responsive(styles['containerPortrait']),
    },
    top: {
      ...styles['top'],
    },
    counter: {
      ...styles['counter'],
    },
    slider: {
      ...styles['slider'],
    },
    labelButton: {
      ...styles['labelButton'],
    },
    sightOverlay: {
      ...styles['sightOverlay'],
    },
  };
}

import { CSSProperties } from 'react';
import { styles } from './PhotoCaptureHUDPreview.styles';

export interface PhotoCaptureHUDPreview {
  containerStyle: CSSProperties;
  top: CSSProperties;
  counter: CSSProperties;
  slider: CSSProperties;
  labelButton: CSSProperties;
}

export function usePhotoCaptureHUDPreview(): PhotoCaptureHUDPreview {
  return {
    containerStyle: {
      ...styles['container'],
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
  };
}

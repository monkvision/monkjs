import { InteractiveStatus } from '@monkvision/types';
import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import {
  captureButtonBackgroundColors,
  captureButtonForegroundColors,
  styles,
} from './CaptureHUDButtons.styles';

interface PhotoCaptureHUDButtonsStylesParams {
  galleryStatus: InteractiveStatus;
  closeStatus: InteractiveStatus;
  galleryPreviewUrl?: string;
}

interface PhotoCaptureHUDButtonsStyles {
  containerStyle: CSSProperties;
  gallery: {
    style: CSSProperties;
    iconColor: string;
  };
  close: {
    style: CSSProperties;
    iconColor: string;
  };
  backgroundCoverStyle: CSSProperties;
}

export function useCaptureHUDButtonsStyles(
  params: PhotoCaptureHUDButtonsStylesParams,
): PhotoCaptureHUDButtonsStyles {
  const { responsive } = useResponsiveStyle();

  return {
    containerStyle: {
      ...styles['container'],
      ...responsive(styles['containersPortrait']),
    },
    gallery: {
      style: {
        ...styles['button'],
        backgroundColor: captureButtonBackgroundColors[params.galleryStatus],
        borderColor: captureButtonForegroundColors[params.galleryStatus],
        ...(params.galleryStatus === InteractiveStatus.DISABLED ? styles['buttonDisabled'] : {}),
      },
      iconColor: captureButtonForegroundColors[params.galleryStatus],
    },
    close: {
      style: {
        ...styles['button'],
        backgroundColor: captureButtonBackgroundColors[params.closeStatus],
        borderColor: captureButtonForegroundColors[params.closeStatus],
        ...(params.closeStatus === InteractiveStatus.DISABLED ? styles['buttonDisabled'] : {}),
      },
      iconColor: captureButtonForegroundColors[params.closeStatus],
    },
    backgroundCoverStyle: {
      ...styles['backgroundCover'],
      backgroundImage: params.galleryPreviewUrl ? `url(${params.galleryPreviewUrl})` : 'none',
    },
  };
}

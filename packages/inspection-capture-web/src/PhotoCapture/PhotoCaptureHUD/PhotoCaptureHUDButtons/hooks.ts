import { InteractiveStatus } from '@monkvision/types';
import { CSSProperties, useState } from 'react';
import {
  timeoutPromise,
  useAsyncEffect,
  useMonkTheme,
  useResponsiveStyle,
} from '@monkvision/common';
import {
  captureButtonForegroundColors,
  styles,
  captureButtonBackgroundColors,
} from './PhotoCaptureHUDButtons.styles';
import { ActionButtonProps } from './PhotoCaptureHUDButtons.model';

type PhotoCaptureHUDButtonsStylesParams = Exclude<ActionButtonProps, 'onClose'> & {
  galleryStatus: InteractiveStatus;
  closeStatus: InteractiveStatus;
  closeBtnAvailable: boolean;
  galleryPreview?: string;
  showGalleryBadge?: boolean;
};

interface PhotoCaptureHUDButtonsStyles {
  containerStyle: CSSProperties;
  gallery: {
    style: CSSProperties;
    iconColor: string;
  };
  galleryBadgeStyle: CSSProperties;
  close: {
    style: CSSProperties;
    iconColor: string;
  };
  backgroundCoverStyle: CSSProperties;
}

const ANIMATION_DELAY_MS = 50;

export function useCaptureHUDButtonsStyles(
  params: PhotoCaptureHUDButtonsStylesParams,
): PhotoCaptureHUDButtonsStyles {
  const [backgroundAnimationStart, setBackgroundAnimationStart] = useState(false);
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  useAsyncEffect(
    () => {
      setBackgroundAnimationStart(true);
      return timeoutPromise(ANIMATION_DELAY_MS);
    },
    [params.galleryPreview],
    {
      onResolve: () => setBackgroundAnimationStart(false),
    },
  );

  return {
    containerStyle: {
      ...styles['container'],
      ...responsive(styles['containersPortrait']),
      ...responsive(styles['containersLandscape']),
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
    galleryBadgeStyle: {
      ...styles['buttonBadge'],
      backgroundColor: palette.alert.base,
      color: palette.text.primary,
      visibility: params.showGalleryBadge ? 'visible' : 'hidden',
    },
    close: {
      style: {
        ...styles['button'],
        backgroundColor: captureButtonBackgroundColors[params.closeStatus],
        borderColor: captureButtonForegroundColors[params.closeStatus],
        ...(params.closeStatus === InteractiveStatus.DISABLED ? styles['buttonDisabled'] : {}),
        visibility: params.showCloseButton ? 'visible' : 'hidden',
      },
      iconColor: captureButtonForegroundColors[params.closeStatus],
    },
    backgroundCoverStyle: {
      ...styles['backgroundCover'],
      backgroundImage: params.galleryPreview ? `url(${params.galleryPreview})` : 'none',
      transition: backgroundAnimationStart ? 'none' : 'transform 0.2s ease-out',
      transform: `scale(${backgroundAnimationStart ? 0.3 : 1})`,
    },
  };
}

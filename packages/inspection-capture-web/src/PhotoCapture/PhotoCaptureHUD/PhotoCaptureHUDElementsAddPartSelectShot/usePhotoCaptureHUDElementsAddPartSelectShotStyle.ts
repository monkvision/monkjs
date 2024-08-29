import { useMonkTheme } from '@monkvision/common';
import { CSSProperties } from 'react';
import { PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH } from '../PhotoCaptureHUDButtons/PhotoCaptureHUDButtons.styles';

export function usePhotoCaptureHUDElementsAddPartSelectShotStyle(): Record<
  | 'notification'
  | 'closeButton'
  | 'infoNotification'
  | 'partSelectNotification'
  | 'stackItem'
  | 'wrapper',
  CSSProperties
> {
  const { palette } = useMonkTheme();
  return {
    notification: {
      position: 'absolute',
      padding: '10px 20px',
      borderRadius: 30,
      color: palette.information.xdark,
      backgroundColor: palette.information.xlight,
    },
    infoNotification: {
      top: 20,
    },
    partSelectNotification: {
      bottom: 20,
      maxWidth: `calc(98% - (${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 8}px))`,
      fontSize: 14,
    },
    stackItem: {
      position: 'absolute',
      inset: 0,
      backgroundColor: palette.background.base,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    wrapper: {
      width: `calc(98% - (${PHOTO_CAPTURE_HUD_BUTTONS_BAR_WIDTH * 4}px))`,
      height: '100%',
      backgroundColor: palette.background.dark,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      left: 22,
      top: 22,
      width: 44,
      height: 44,
    },
  };
}

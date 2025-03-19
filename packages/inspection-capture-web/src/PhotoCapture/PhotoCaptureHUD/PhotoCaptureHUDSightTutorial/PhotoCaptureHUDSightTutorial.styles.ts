import { Styles } from '@monkvision/types';
import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { useCallback } from 'react';

const BORDER_WIDTH = 2;

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    zIndex: 10,
    transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out',
    backgroundColor: `rgba(0, 0, 0, 0.5)`,
    backdropFilter: 'blur(10px)',
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
  },
  containerVisible: {
    opacity: 1,
    visibility: 'visible',
    pointerEvents: 'auto',
  },
  iconsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    width: '20%',
  },
  sightIcon: { width: '85px' },
  tutorialContainer: {
    position: 'absolute',
    width: '60%',
    height: '80%',
    borderRadius: '9px',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '50px',
  },
  guideline: {
    display: 'flex',
    overflow: 'scroll',
    height: '35%',
    padding: '0px 10px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: { height: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  closeButton: {
    padding: '0px 20px',
    height: '100%',
    borderRadius: 0,
  },
  closeButtonFiller: { visibility: 'hidden', padding: '0px 20px', height: '100%', borderRadius: 0 },
  imageContainer: {
    height: '60%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '90%',
    objectFit: 'contain',
    borderRadius: '9px',
  },
  sightIconWidth: {
    strokeWidth: '10px',
  },
};

export function usePhotoCaptureHUDSightTutorialStyles(show?: boolean) {
  const { palette } = useMonkTheme();
  const borderColor = palette.surface.light;

  const getIconAttributes = useCallback(() => ({ style: styles['sightIconWidth'] }), []);

  return {
    container: {
      ...styles['container'],
      ...(show ? styles['containerVisible'] : {}),
    },
    tutorialContainer: {
      ...styles['tutorialContainer'],
      backgroundColor: changeAlpha(palette.secondary.xdark, 0.7),
      border: `solid ${BORDER_WIDTH}px ${changeAlpha(borderColor, 0.5)}`,
    },
    closeButton: {
      ...styles['closeButton'],
      // borderLeft: `solid ${BORDER_WIDTH}px ${borderColor}`,
    },
    guideline: {
      ...styles['guideline'],
      // backgroundColor: `${changeAlpha(palette.background.base, 0.5)}`,
      // borderTop: `solid ${BORDER_WIDTH}px ${borderColor}`,
      // borderBottom: `solid ${BORDER_WIDTH}px ${borderColor}`,
      // color: `${palette.text.black}`,
    },
    sightIcon: {
      getAttributes: getIconAttributes,
    },
  };
}

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
  classicTutorialContainer: {
    position: 'absolute',
    width: '60%',
    height: '80%',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'scroll',
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
  classicTitleContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '10%',
  },
  classicTitle: {
    fontSize: '18px',
    fontWeight: 700,
  },
  guidelineContainer: {
    height: '40%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 30px',
  },
  guideline: {
    margin: 'auto',
    textAlign: 'center',
    whiteSpace: 'pre-line',
    lineHeight: '24px',
  },
  classicGuidelineContainer: {
    height: '40%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 30px',
  },
  classicGuideline: {
    margin: 'auto',
    textAlign: 'center',
    whiteSpace: 'pre-line',
    lineHeight: '24px',
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
  classicImageContainer: {
    height: '50%',
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
    strokeWidth: '6px',
  },
};

export function usePhotoCaptureHUDSightTutorialStyles(show?: boolean, tutorialImage?: boolean) {
  const { palette } = useMonkTheme();

  const getIconAttributes = useCallback(() => ({ style: styles['sightIconWidth'] }), []);

  return {
    container: {
      ...styles['container'],
      ...(show ? styles['containerVisible'] : {}),
    },
    tutorialContainer: {
      ...styles['tutorialContainer'],
      backgroundColor: changeAlpha(palette.background.base, 0.7),
      border: `solid ${BORDER_WIDTH}px ${changeAlpha(palette.surface.light, 0.5)}`,
    },
    classicTutorialContainer: {
      ...styles['classicTutorialContainer'],
      backgroundColor: palette.text.white,
      color: palette.text.black,
    },
    classicTitleContainer: {
      ...styles['classicTitleContainer'],
      borderBottom: `solid ${BORDER_WIDTH}px ${palette.secondary.xlight}`,
    },
    closeButton: {
      ...styles['closeButton'],
    },
    guidelineContainer: {
      ...styles['guidelineContainer'],
      ...(!tutorialImage ? { height: '90%' } : {}),
    },
    guideline: {
      ...styles['guideline'],
      ...(!tutorialImage ? { alignItems: 'center' } : {}),
    },
    classicGuidelineContainer: {
      ...styles['classicGuidelineContainer'],
      ...(!tutorialImage ? { height: '90%' } : {}),
    },
    classicGuideline: {
      ...styles['classicGuideline'],
      ...(!tutorialImage ? { alignItems: 'center' } : {}),
    },
    sightIcon: {
      getAttributes: getIconAttributes,
    },
  };
}

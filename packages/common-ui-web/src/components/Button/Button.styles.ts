import { InteractiveStatus, Styles } from '@monkvision/types';

export const BUTTON_CONTENT_SIZE_NORMAL = 24;
export const BUTTON_CONTENT_SIZE_SMALL = 18;

export const buttonTextBackgrounds = {
  [InteractiveStatus.DEFAULT]: 'transparent',
  [InteractiveStatus.HOVERED]: '#FFFFFF14',
  [InteractiveStatus.ACTIVE]: '#FFFFFF1F',
  [InteractiveStatus.DISABLED]: 'transparent',
};

export const styles: Styles = {
  button: {
    padding: '10px 24px',
    borderRadius: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: 0.15,
    cursor: 'pointer',
    borderWidth: 0,
  },
  buttonIconOnly: {
    padding: 16,
  },
  buttonDisabled: {
    opacity: 0.37,
    cursor: 'default',
  },
  buttonSmall: {
    padding: '6px 16px',
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: 0.1,
  },
  buttonIconOnlySmall: {
    padding: 6,
  },
  buttonOutline: {
    borderStyle: 'solid',
    borderWidth: 2,
  },
  buttonTextLink: {
    padding: 0,
  },
  icon: {
    marginRight: 10,
  },
  iconSmall: {
    marginRight: 8,
  },
  iconOnly: {
    marginRight: 0,
  },
  fixedLoadingContainer: {
    position: 'relative',
  },
  loadingHiddenContent: {
    visibility: 'hidden',
  },
  spinnerFixedWith: {
    position: 'absolute',
  },
};

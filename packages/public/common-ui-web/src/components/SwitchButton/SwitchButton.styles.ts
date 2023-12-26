import { Styles } from '@monkvision/types';

export const slideTransitionFrames = '0.3s ease-out';

export const sizes = {
  normal: {
    width: 65,
    height: 30,
    knobPadding: 2,
    labelPadding: 10,
    knobOverlayExpansion: 3,
    iconSize: 18,
  },
  small: {
    width: 36,
    height: 22,
    knobPadding: 2,
    knobOverlayExpansion: 2,
    iconSize: 10,
  },
};

export const styles: Styles = {
  button: {
    width: sizes.normal.width,
    height: sizes.normal.height,
    padding: `0 ${sizes.normal.labelPadding}px`,
    overflow: 'visible',
    borderRadius: 9999999,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: 'none',
    cursor: 'pointer',
    transition: `background-color ${slideTransitionFrames}`,
  },
  buttonDisabled: {
    opacity: 0.37,
    cursor: 'default',
  },
  buttonSmall: {
    padding: 0,
    width: sizes.small.width,
    height: sizes.small.height,
  },
  knobOverlay: {
    width: sizes.normal.height + 2 * sizes.normal.knobOverlayExpansion,
    height: sizes.normal.height + 2 * sizes.normal.knobOverlayExpansion,
    borderRadius: '50%',
    position: 'absolute',
    top: -sizes.normal.knobOverlayExpansion,
    left: -sizes.normal.knobOverlayExpansion,
    transition: `left ${slideTransitionFrames}`,
  },
  knobOverlaySmall: {
    width: sizes.small.height + 2 * sizes.small.knobOverlayExpansion,
    height: sizes.small.height + 2 * sizes.small.knobOverlayExpansion,
    top: -sizes.small.knobOverlayExpansion,
    left: -sizes.small.knobOverlayExpansion,
  },
  knobOverlayChecked: {
    left: sizes.normal.width - sizes.normal.height - sizes.normal.knobOverlayExpansion,
  },
  knobOverlaySmallChecked: {
    left: sizes.small.width - sizes.small.height - sizes.small.knobOverlayExpansion,
  },
  knob: {
    width: sizes.normal.height - 2 * sizes.normal.knobPadding,
    height: sizes.normal.height - 2 * sizes.normal.knobPadding,
    borderRadius: '50%',
    position: 'absolute',
    top: sizes.normal.knobPadding,
    left: sizes.normal.knobPadding,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `left ${slideTransitionFrames}`,
  },
  knobSmall: {
    width: sizes.small.height - 2 * sizes.small.knobPadding,
    height: sizes.small.height - 2 * sizes.small.knobPadding,
    top: sizes.small.knobPadding,
    left: sizes.small.knobPadding,
  },
  knobChecked: {
    left: sizes.normal.width - sizes.normal.height + sizes.normal.knobPadding,
  },
  knobSmallChecked: {
    left: sizes.small.width - sizes.small.height + sizes.small.knobPadding,
  },
  label: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: '18px',
    letterSpacing: '0.4px',
    transition: `opacity ${slideTransitionFrames}`,
  },
  icon: {
    transition: `opacity ${slideTransitionFrames}`,
  },
};

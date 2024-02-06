import { Styles } from '@monkvision/types';

export const styles: Styles = {
  sliderStyle: {
    position: 'relative',
    display: 'flex',
    width: '129px',
    height: '25px',
    background: 'transparent',
    cursor: 'pointer',
    margin: '20px',
    alignItems: 'center',
  },
  trackBarStyle: {
    position: 'absolute',
    width: '100%',
    height: '3px',
    borderRadius: '5px',
  },
  thumbStyle: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: 'solid 3px',
  },
  thumbSmall: {
    width: '11px',
    height: '11px',
  },
  progressBarStyle: {
    position: 'absolute',
    height: '3px',
    borderRadius: '5px',
  },
  sliderDisabled: {
    opacity: 0.37,
    cursor: 'default',
  },
  hoverStyle: {
    background: 'transparent',
    border: 'none',
    width: '25px',
    height: '25px',
  },
  hovered: {
    border: 'solid 15px',
    opacity: '15%',
  },
};

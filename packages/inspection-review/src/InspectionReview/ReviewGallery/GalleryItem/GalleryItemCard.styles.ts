import { Styles } from '@monkvision/types';

const CARD_WIDTH_PX = 140;
const CARD_BORDER_RADIUS_PX = 8;

export const styles: Styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: CARD_WIDTH_PX,
    height: 'fit-content',
    borderRadius: CARD_BORDER_RADIUS_PX,
    border: 'none',
    outline: 'none',
    padding: 0,
    backgroundColor: 'transparent',
  },
  preview: {
    position: 'relative',
    width: '100%',
    height: 82,
    boxSizing: 'border-box',
    borderTopLeftRadius: CARD_BORDER_RADIUS_PX,
    borderTopRightRadius: CARD_BORDER_RADIUS_PX,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  },
  label: {
    width: '100%',
    height: 46,
    fontSize: 14,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: CARD_BORDER_RADIUS_PX,
    borderBottomRightRadius: CARD_BORDER_RADIUS_PX,
    padding: '0 8px',
  },
};

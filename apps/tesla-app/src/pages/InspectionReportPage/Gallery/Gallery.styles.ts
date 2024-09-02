import { Styles } from '@monkvision/types';

export const ITEM_PADDING_PX = 6;
export const GALLERY_PADDING_PX = 24;
export const CARD_WIDTH_PX = 10;
export const CARD_BORDER_RADIUS_PX = 8;

export const styles: Styles = {
  container: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
    padding: `${60 + GALLERY_PADDING_PX}px ${GALLERY_PADDING_PX}px ${GALLERY_PADDING_PX}px`,
  },
  containerSmallScreen: {
    __media: { maxWidth: 550 },
    padding: `${60 + GALLERY_PADDING_PX}px 0 ${GALLERY_PADDING_PX}px`,
  },
  itemList: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  item: {
    boxSizing: 'border-box',
    padding: ITEM_PADDING_PX,
  },
  fillerItem: {
    width: CARD_WIDTH_PX + 2 * ITEM_PADDING_PX,
    visibility: 'hidden',
  },
  empty: {
    fontSize: 14,
    padding: '50px 50px 0 50px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: CARD_WIDTH_PX,
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
};

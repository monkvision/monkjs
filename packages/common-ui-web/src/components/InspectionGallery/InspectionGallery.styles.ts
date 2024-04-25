import { Styles } from '@monkvision/types';
import { CARD_WIDTH_PX } from './InspectionGalleryItemCard/InspectionGalleryItemCard.styles';

export const ITEM_PADDING_PX = 6;
export const GALLERY_PADDING_PX = 24;

export const styles: Styles = {
  container: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
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
};

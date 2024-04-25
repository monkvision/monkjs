import { useWindowDimensions } from '@monkvision/common';
import { GALLERY_PADDING_PX, ITEM_PADDING_PX } from '../InspectionGallery.styles';
import { CARD_WIDTH_PX } from '../InspectionGalleryItemCard/InspectionGalleryItemCard.styles';

export function useItemListFillers(itemCount: number): number {
  const dimensions = useWindowDimensions();
  if (!dimensions) {
    return 0;
  }
  const itemWidth = CARD_WIDTH_PX + 2 * ITEM_PADDING_PX;
  const listWidth = dimensions.width - 2 * GALLERY_PADDING_PX;
  const itemsPerRow = Math.floor(listWidth / itemWidth);
  return itemsPerRow - (itemCount % itemsPerRow);
}

import { useInteractiveStatus, useObjectTranslation } from '@monkvision/common';
import { GalleryItem } from '../../types';
import { useGalleryItemCardStyles } from './GalleryItemCard.styles';
import { HandleGalleryState } from '../hooks';

/**
 * Props accepted by the GalleryItemCard component.
 */
export type GalleryItemProps = Pick<HandleGalleryState, 'onSelectItemById'> & {
  /**
   * The gallery item to be displayed.
   */
  item: GalleryItem;
};

/**
 * The GalleryItemCard component that displays an individual gallery item as a card.
 */
export function GalleryItemCard({ item, onSelectItemById }: GalleryItemProps) {
  const { tObj } = useObjectTranslation();
  const { status, eventHandlers } = useInteractiveStatus();
  const { cardStyle, previewStyle, labelStyle } = useGalleryItemCardStyles({
    item,
    status,
  });

  return (
    <button
      key={item.image.id}
      style={cardStyle}
      onClick={() => onSelectItemById(item.image.id)}
      {...eventHandlers}
    >
      <div style={previewStyle} data-testid='preview' />
      <div style={labelStyle}>{item.image.label ? tObj(item.image.label) : ''}</div>
    </button>
  );
}

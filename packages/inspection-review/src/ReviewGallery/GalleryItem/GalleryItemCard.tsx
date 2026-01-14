import { useInteractiveStatus, useObjectTranslation } from '@monkvision/common';
import { GalleryItem } from '../../types';
import { useGalleryItemCardStyles } from './useGalleryItemCardStyles';

/**
 * Props accepted by the GalleryItemCard component.
 */
export interface GalleryItemProps {
  /**
   * The gallery item to be displayed.
   */
  item: GalleryItem;
  /**
   * Callback function invoked when the item is selected.
   */
  onSelectItem: (id: string) => void;
}

/**
 * The GalleryItemCard component that displays an individual gallery item as a card.
 */
export function GalleryItemCard({ item, onSelectItem }: GalleryItemProps) {
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
      onClick={() => onSelectItem(item.image.id)}
      {...eventHandlers}
    >
      <div style={previewStyle} data-testid='preview' />
      <div style={labelStyle}>{item.image.label ? tObj(item.image.label) : ''}</div>
    </button>
  );
}

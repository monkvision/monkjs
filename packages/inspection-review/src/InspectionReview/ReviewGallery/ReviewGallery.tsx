import { useInspectionReviewState } from '../hooks/InspectionReviewProvider';
import { GalleryItemCard } from './GalleryItem/GalleryItemCard';
import { useGalleryState } from './hooks/useGalleryState';
import { styles } from './ReviewGallery.styles';
import { SpotlightImage } from './SpotlightImage';

/**
 * The ReviewGallery component that displays a gallery of images for review.
 */
export function ReviewGallery() {
  const { currentGalleryItems } = useInspectionReviewState();
  const { selectedItem, showDamage, onSelectItem } = useGalleryState({
    galleryItems: currentGalleryItems,
  });

  if (selectedItem) {
    return <SpotlightImage selectedItem={selectedItem} showDamage={showDamage} />;
  }

  return (
    <div style={styles['container']}>
      {currentGalleryItems.map((item) => (
        <GalleryItemCard key={item.image.id} item={item} onSelectItem={onSelectItem} />
      ))}
    </div>
  );
}

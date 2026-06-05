import { useInspectionReviewState } from '../hooks/InspectionReviewProvider';
import { GalleryItemCard } from './GalleryItem/GalleryItemCard';
import { useGalleryState } from './hooks/useGalleryState';
import { styles } from './ReviewGallery.styles';
import { SpotlightImage } from './SpotlightImage';
import { useShortcuts } from './SpotlightImage/Shortcuts/hooks/useShortcuts';

/**
 * The ReviewGallery component that displays a gallery of images for review.
 */
export function ReviewGallery() {
  const { currentGalleryItems } = useInspectionReviewState();
  const { selectedItem, onSelectItemById, onSelectItem } = useGalleryState();
  const { showDamage, toggleShowDamage, goToNextImage, goToPreviousImage } = useShortcuts({
    selectedItem,
    onSelectItem,
  });

  if (selectedItem) {
    return (
      <SpotlightImage
        selectedItem={selectedItem}
        showDamage={showDamage}
        onSelectItem={onSelectItem}
        toggleShowDamage={toggleShowDamage}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
      />
    );
  }

  return (
    <div style={styles['container']}>
      {currentGalleryItems.map((item) => (
        <GalleryItemCard key={item.image.id} item={item} onSelectItem={onSelectItemById} />
      ))}
    </div>
  );
}

import { useInspectionReviewProvider } from '../hooks/InspectionReviewProvider';
import { GalleryItemCard } from './GalleryItem/GalleryItemCard';
import { useGalleryState } from './hooks/useGalleryState';
import { styles } from './ReviewGallery.styles';
import { SpotlightImage } from './SpotlightImage';
import { useShortcuts } from './SpotlightImage/Shortcuts/hooks/useShortcuts';

/**
 * The ReviewGallery component that displays a gallery of images for review.
 */
export function ReviewGallery() {
  const { currentGalleryItems } = useInspectionReviewProvider();
  const { selectedItem, onSelectItemById } = useGalleryState();
  const { showDamage, toggleShowDamage, goToNextImage, goToPreviousImage } = useShortcuts({
    selectedItem,
    onSelectItemById,
  });

  if (selectedItem) {
    return (
      <SpotlightImage
        selectedItem={selectedItem}
        showDamage={showDamage}
        onSelectItemById={onSelectItemById}
        toggleShowDamage={toggleShowDamage}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
      />
    );
  }

  return (
    <div style={styles['container']}>
      {currentGalleryItems.map((item) => (
        <GalleryItemCard key={item.image.id} item={item} onSelectItemById={onSelectItemById} />
      ))}
    </div>
  );
}

import { useInspectionReviewProvider } from '../../hooks';
import { GalleryItemCard } from './GalleryItem/GalleryItemCard';
import { styles } from './ReviewGallery.styles';
import { SpotlightImage } from './SpotlightImage';
import { useShortcuts } from './SpotlightImage/Shortcuts/hooks/useShortcuts';

/**
 * The ReviewGallery component that displays a gallery of images for review.
 */
export function ReviewGallery() {
  const { currentGalleryItems, selectedItem, onSelectItemById } = useInspectionReviewProvider();
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

import { useInspectionReviewState } from '../hooks';
import { useGalleryState } from './hooks/useGalleryState';
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
    <div style={{ display: 'flex', flexWrap: 'wrap', flex: 6, gap: 8 }}>
      {currentGalleryItems.map((item) => (
        <img
          key={item.image.id}
          src={item.image.path}
          onClick={() => onSelectItem(item.image.id)}
          style={{
            height: 152,
            width: 140,
            backgroundColor: 'gray',
            textAlign: 'center',
          }}
        />
      ))}
    </div>
  );
}

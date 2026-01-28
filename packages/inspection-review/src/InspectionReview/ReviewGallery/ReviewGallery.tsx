import { useInspectionReviewState } from '../hooks';
import { useGalleryState } from './hooks/useGalleryState';
import { SpotlightImage } from './SpotlightImage';

/**
 * The ReviewGallery component that displays a gallery of images for review.
 */
export function ReviewGallery() {
  const { galleryItems } = useInspectionReviewState();
  const { selectedImage, showDamage, onSelectImage } = useGalleryState({ galleryItems });

  if (selectedImage) {
    return <SpotlightImage selectedImage={selectedImage} showDamage={showDamage} />;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', flex: 6, gap: 8 }}>
      {galleryItems.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectImage(item.id)}
          style={{
            height: 152,
            width: 140,
            backgroundColor: 'gray',
            textAlign: 'center',
          }}
        >
          Item {item.inspectionId}
        </div>
      ))}
    </div>
  );
}

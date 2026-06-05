import { Image } from '@monkvision/types';

/**
 * Props accepted by the SpotlightImage component.
 */
export interface SpotlightImageProps {
  /**
   * The image to be displayed in the spotlight.
   */
  selectedImage: Image;
  /**
   * Flag indicating whether to show damage annotations on the image.
   */
  showDamage: boolean;
}

/**
 * The SpotlightImage component that displays the selected image in a spotlight view instead of the gallery view.
 */
export function SpotlightImage({ selectedImage, showDamage }: SpotlightImageProps) {
  return (
    <div style={{ flex: 6, width: '100%', height: 300, backgroundColor: 'bisque' }}>
      <p>
        Showing {showDamage ? 'damage' : 'picture'} for {selectedImage.id}
      </p>
    </div>
  );
}

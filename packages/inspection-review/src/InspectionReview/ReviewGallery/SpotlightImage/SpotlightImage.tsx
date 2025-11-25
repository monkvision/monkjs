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
    <img
      src={selectedImage.path}
      style={{
        position: 'relative',
        flex: 6,
        width: '100%',
        height: 300,
        backgroundColor: 'bisque',
      }}
    >
      {showDamage && (
        <p
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            color: 'white',
            backgroundColor: 'red',
            padding: 4,
          }}
        >
          Showing damage for {selectedImage.id}
        </p>
      )}
    </img>
  );
}

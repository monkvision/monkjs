import { GalleryItem } from '../../hooks';

/**
 * Props accepted by the SpotlightImage component.
 */
export interface SpotlightImageProps {
  /**
   * The image to be displayed in the spotlight.
   */
  selectedItem: GalleryItem;
  /**
   * Flag indicating whether to show damage annotations on the image.
   */
  showDamage: boolean;
}

/**
 * The SpotlightImage component that displays the selected image in a spotlight view instead of the gallery view.
 */
export function SpotlightImage({ selectedItem, showDamage }: SpotlightImageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        justifyContent: 'space-between',
        inset: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={
          showDamage && selectedItem.renderedOutput
            ? selectedItem.renderedOutput.path
            : selectedItem.image.path
        }
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
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
          Showing damage for {selectedItem.image.id}
        </p>
      )}
    </div>
  );
}

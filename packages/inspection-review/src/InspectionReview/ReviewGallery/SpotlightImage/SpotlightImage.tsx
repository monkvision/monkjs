import { useObjectTranslation } from '@monkvision/common';
import { GalleryItem } from '../../types';
import { useSpotlightImage } from './hooks/useSpotlightImage';
import { styles } from './SpotlightImage.styles';

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
  const { tObj } = useObjectTranslation();
  const { backgroundImage, isMouseOver, cursorStyle } = useSpotlightImage({
    image: selectedItem.image,
    showDamage,
  });

  return (
    <div
      className='spotlight-image'
      style={{
        position: 'relative',
        display: 'flex',
        flex: 6,
        width: '100%',
        height: '100%',
        cursor: cursorStyle,
      }}
    >
      {isMouseOver && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              cursor: 'pointer',
            }}
          >
            close
          </div>

          {selectedItem.renderedOutput && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                cursor: 'pointer',
              }}
            >
              Show Damages
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              bottom: 10,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <div>left</div>
            <div>{selectedItem.image.label ? tObj(selectedItem.image.label) : ''}</div>
            <div>right</div>
          </div>
        </>
      )}
      <img src={backgroundImage} alt={selectedItem.image.id} style={styles['imageContainer']} />
    </div>
  );
}

import { useObjectTranslation } from '@monkvision/common';
import { GalleryItem } from '../../types';
import { useSpotlightImage } from './hooks/useSpotlightImage';
import { styles } from './SpotlightImage.styles';
import { Shortcuts } from './Shortcuts';

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
    <div className='spotlight-image' style={{ ...styles['container'], cursor: cursorStyle }}>
      <div style={{ position: 'relative' }}>
        {isMouseOver && (
          <>
            <div style={styles['closeButton']}>X</div>

            {selectedItem.renderedOutput && (
              <div style={styles['showDamagesButton']}>Show Damages</div>
            )}

            <div style={styles['imageNavigationContainer']}>
              <div>left</div>
              <div>{selectedItem.image.label ? tObj(selectedItem.image.label) : ''}</div>
              <div>right</div>
            </div>
          </>
        )}
        <img src={backgroundImage} alt={selectedItem.image.id} style={styles['imageContainer']} />
      </div>
      <div style={styles['shortcutsContainer']}>
        <Shortcuts />
      </div>
    </div>
  );
}

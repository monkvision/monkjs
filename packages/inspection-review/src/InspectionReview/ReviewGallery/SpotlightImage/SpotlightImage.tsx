import { useTranslation } from 'react-i18next';
import { useObjectTranslation } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { GalleryItem } from '../../types';
import { useSpotlightImage } from './hooks/useSpotlightImage';
import { styles } from './SpotlightImage.styles';
import { Shortcuts } from './Shortcuts';
import { useSpotlightImageStyles } from './hooks/useSpotlightImageStyles';

/**
 * Props accepted by the SpotlightImage component.
 */
export interface SpotlightImageProps {
  /**
   * The image to be displayed in the spotlight.
   */
  selectedItem: GalleryItem;
  /**
   * Flag indicating whether to show damage on the selected image.
   */
  showDamage: boolean;
  /**
   * Function to toggle the show damage state.
   */
  toggleShowDamage: () => void;
  /**
   * Function to navigate to the previous image in the gallery.
   */
  goToPreviousImage: () => void;
  /**
   * Function to navigate to the next image in the gallery.
   */
  goToNextImage: () => void;
  /**
   * Function to select or deselect an item by its image.
   */
  onSelectItem: (image: GalleryItem | null) => void;
}

/**
 * The SpotlightImage component that displays the selected image in a spotlight view instead of the gallery view.
 */
export function SpotlightImage({
  selectedItem,
  onSelectItem,
  goToNextImage,
  goToPreviousImage,
  showDamage,
  toggleShowDamage,
}: SpotlightImageProps) {
  const { tObj } = useObjectTranslation();
  const { t } = useTranslation();

  const { iconButton, showDamageButton, imageLabelStyle } = useSpotlightImageStyles();
  const { backgroundImage, isMouseOver, cursorStyle } = useSpotlightImage({
    image: selectedItem.image,
    showDamage,
  });

  return (
    <div className='spotlight-image' style={{ ...styles['container'], cursor: cursorStyle }}>
      <div style={{ position: 'relative' }}>
        {isMouseOver && (
          <>
            <div style={styles['closeButton']}>
              <Button
                onClick={() => onSelectItem(null)}
                icon='close'
                size='small'
                primaryColor={iconButton.primaryColor}
                secondaryColor={iconButton.secondaryColor}
              />
            </div>

            {selectedItem.hasDamage && (
              <div style={styles['showDamagesButton']}>
                <Button
                  onClick={toggleShowDamage}
                  icon={showDamage ? 'visibility-off' : 'visibility-on'}
                  primaryColor={showDamageButton.primaryColor}
                  secondaryColor={showDamageButton.secondaryColor}
                >
                  {showDamage
                    ? t('gallery.spotlight.hideDamages')
                    : t('gallery.spotlight.showDamages')}
                </Button>
              </div>
            )}

            <div style={styles['imageNavigationContainer']}>
              <Button
                style={styles['iconButton']}
                onClick={goToPreviousImage}
                icon='chevron-left'
                primaryColor={iconButton.primaryColor}
                secondaryColor={iconButton.secondaryColor}
              />
              <div style={imageLabelStyle}>
                {selectedItem.image.label ? tObj(selectedItem.image.label) : ''}
              </div>
              <Button
                style={styles['iconButton']}
                onClick={goToNextImage}
                icon='chevron-right'
                primaryColor={iconButton.primaryColor}
                secondaryColor={iconButton.secondaryColor}
              />
            </div>
          </>
        )}
        <img src={backgroundImage} alt={selectedItem.image.id} style={styles['imageContainer']} />
      </div>
      <div style={styles['shortcutsContainer']}>
        <Shortcuts showDamage={showDamage} />
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { useObjectTranslation } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { GalleryItem } from '../../types';
import { useSpotlightImage } from './hooks/useSpotlightImage';
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

  const { backgroundImage, isMouseOver, cursorStyle } = useSpotlightImage({
    image: selectedItem.image,
    showDamage,
  });
  const {
    iconButtonStyle,
    showDamageButtonStyle,
    imageLabelStyle,
    containerStyle,
    overlayContainerStyle,
    closeButtonStyle,
    hasDamagesButtonStyle,
    imageNavigationContainerStyle,
    imageContainerStyle,
    shortcutsContainerStyle,
  } = useSpotlightImageStyles({
    cursorStyle,
  });

  return (
    <div className='spotlight-image' style={containerStyle}>
      <div style={overlayContainerStyle}>
        {isMouseOver && (
          <>
            <div style={closeButtonStyle}>
              <Button
                onClick={() => onSelectItem(null)}
                icon='close'
                size='small'
                primaryColor={iconButtonStyle.primaryColor}
                secondaryColor={iconButtonStyle.secondaryColor}
              />
            </div>

            {selectedItem.hasDamage && (
              <div style={hasDamagesButtonStyle}>
                <Button
                  onClick={toggleShowDamage}
                  icon={showDamage ? 'visibility-off' : 'visibility-on'}
                  primaryColor={showDamageButtonStyle.primaryColor}
                  secondaryColor={showDamageButtonStyle.secondaryColor}
                >
                  {showDamage
                    ? t('gallery.spotlight.hideDamages')
                    : t('gallery.spotlight.showDamages')}
                </Button>
              </div>
            )}

            <div style={imageNavigationContainerStyle}>
              <Button
                style={iconButtonStyle}
                onClick={goToPreviousImage}
                icon='chevron-left'
                primaryColor={iconButtonStyle.primaryColor}
                secondaryColor={iconButtonStyle.secondaryColor}
              />
              <div style={imageLabelStyle}>
                {selectedItem.image.label ? tObj(selectedItem.image.label) : ''}
              </div>
              <Button
                style={iconButtonStyle}
                onClick={goToNextImage}
                icon='chevron-right'
                primaryColor={iconButtonStyle.primaryColor}
                secondaryColor={iconButtonStyle.secondaryColor}
              />
            </div>
          </>
        )}
        <img src={backgroundImage} alt={selectedItem.image.id} style={imageContainerStyle} />
      </div>
      <div style={shortcutsContainerStyle}>
        <Shortcuts showDamage={showDamage} />
      </div>
    </div>
  );
}

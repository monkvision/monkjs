import { useTranslation } from 'react-i18next';
import { useObjectTranslation } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useSpotlightImage } from './hooks/useSpotlightImage';
import { Shortcuts } from './Shortcuts';
import { styles, useSpotlightImageStyles } from './SpotlightImage.styles';
import { HandleGalleryState } from '../hooks';
import { UseShortcutsState } from './Shortcuts/hooks/useShortcuts';

/**
 * Props accepted by the SpotlightImage component.
 */
export type SpotlightImageProps = Pick<HandleGalleryState, 'selectedItem' | 'onSelectItemById'> &
  Pick<
    UseShortcutsState,
    'showDamage' | 'toggleShowDamage' | 'goToPreviousImage' | 'goToNextImage'
  >;

/**
 * The SpotlightImage component that displays the selected image in a spotlight view instead of the gallery view.
 */
export function SpotlightImage({
  selectedItem,
  onSelectItemById,
  goToNextImage,
  goToPreviousImage,
  showDamage,
  toggleShowDamage,
}: SpotlightImageProps) {
  const { tObj } = useObjectTranslation();
  const { t } = useTranslation();

  const {
    backgroundImage,
    isMouseOver,
    cursorStyle,
    ref,
    handleMouseDown,
    handleMouseUp,
    activationKeys,
  } = useSpotlightImage({
    image: selectedItem?.image,
    showDamage,
  });
  const { iconButtonStyle, showDamageButtonStyle, imageLabelStyle, containerStyle } =
    useSpotlightImageStyles({
      cursorStyle,
    });

  return (
    <div className='spotlight-image' style={containerStyle}>
      <div style={styles['overlayContainer']}>
        {isMouseOver && (
          <>
            <div style={styles['actionsContainer']}>
              <div style={styles['closeButton']}>
                <Button
                  onClick={() => onSelectItemById(null)}
                  icon='close'
                  size='small'
                  primaryColor={iconButtonStyle.primaryColor}
                  secondaryColor={iconButtonStyle.secondaryColor}
                />
              </div>

              {selectedItem?.hasDamage && (
                <div style={styles['showDamagesButton']}>
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
            </div>

            <div style={styles['navigationContainer']}>
              <Button
                style={iconButtonStyle}
                onClick={goToPreviousImage}
                icon='chevron-left'
                primaryColor={iconButtonStyle.primaryColor}
                secondaryColor={iconButtonStyle.secondaryColor}
              />
              <div style={imageLabelStyle}>
                {selectedItem?.image.label ? tObj(selectedItem.image.label) : ''}
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
        <TransformWrapper
          ref={ref}
          wheel={{ activationKeys, smoothStep: 0.005 }}
          doubleClick={{ disabled: true }}
          onPanning={handleMouseDown}
          onPanningStop={handleMouseUp}
        >
          <TransformComponent>
            <img src={backgroundImage} alt={backgroundImage} style={styles['imageContainer']} />
          </TransformComponent>
        </TransformWrapper>
      </div>
      <div style={styles['shortcutsContainer']}>
        <Shortcuts showDamage={showDamage} />
      </div>
    </div>
  );
}

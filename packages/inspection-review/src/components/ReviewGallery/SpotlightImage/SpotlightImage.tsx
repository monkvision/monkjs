import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useObjectTranslation } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { useSpotlightImage } from './hooks/useSpotlightImage';
import { useZoomPan } from './hooks/useZoomPan';
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
    handleMouseDown,
    handleMouseUp,
    activationKeys,
  } = useSpotlightImage({
    image: selectedItem?.image,
    showDamage,
  });
  const {
    wrapperRef,
    contentRef,
    contentStyle,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    reset: resetZoomPan,
  } = useZoomPan({
    activationKeys,
    onPanStart: handleMouseDown,
    onPanEnd: handleMouseUp,
  });
  const { iconButtonStyle, showDamageButtonStyle, imageLabelStyle, containerStyle } =
    useSpotlightImageStyles({
      cursorStyle,
    });

  useEffect(() => {
    resetZoomPan();
  }, [selectedItem?.image, resetZoomPan]);

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
        <div
          ref={wrapperRef}
          style={styles['zoomPanWrapper']}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div ref={contentRef} style={{ ...styles['zoomPanContent'], ...contentStyle }}>
            <img
              src={backgroundImage}
              alt={backgroundImage}
              draggable={false}
              style={styles['imageContainer']}
            />
          </div>
        </div>
        <div style={styles['shortcutsContainer']}>
          <Shortcuts showDamage={showDamage} />
        </div>
      </div>
    </div>
  );
}

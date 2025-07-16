import { PhotoCaptureAppConfig, PhotoCaptureSightTutorialOption, Sight } from '@monkvision/types';
import {
  Button,
  IconAroundVehicle,
  IconVerticalPosition,
  SightOverlay,
} from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@monkvision/common';
import { IconVerticalPositionVariant } from '@monkvision/common-ui-web/lib/components/IconVerticalPosition/IconVerticalPosition.types';
import { useEffect, useState } from 'react';
import {
  usePhotoCaptureHUDSightTutorialStyles,
  styles,
} from './PhotoCaptureHUDSightTutorial.styles';

/**
 * The props for the PhotoCaptureHUDSightTutorial component.
 */
export interface PhotoCaptureHUDSightTutorialProps
  extends Pick<PhotoCaptureAppConfig, 'sightTutorial' | 'enableSightTutorial'> {
  /**
   * The sight to display the tutorial for.
   */
  selectedSight: Sight;
  /**
   * Callback called when the user clicks on the "close" button in Sight Tutorial.
   */
  onClose?: () => void;
  /**
   * The current tutorial step in PhotoCapture component.
   */
  show?: boolean;
}

/**
 * This component displays the sight tutorial for a specific sight.
 */
export function PhotoCaptureHUDSightTutorial({
  selectedSight,
  sightTutorial,
  onClose = () => {},
  show,
  enableSightTutorial,
}: PhotoCaptureHUDSightTutorialProps) {
  const [tutorialImage, setTutorialImage] = useState<string | null | undefined>(null);

  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const style = usePhotoCaptureHUDSightTutorialStyles(show, !!tutorialImage);

  const sightTutorialFound = sightTutorial?.find((value) =>
    Object.keys(value.imageReferenceBySightId).includes(selectedSight.id),
  );
  const tutorialGuideline = sightTutorialFound?.[getLanguage(i18n.language)];

  useEffect(() => {
    if (sightTutorialFound?.imageReferenceBySightId[selectedSight.id]) {
      setTutorialImage(sightTutorialFound.imageReferenceBySightId[selectedSight.id]);
    } else if (selectedSight.referencePicture) {
      const img = new Image();
      img.src = selectedSight.referencePicture;

      img.onload = () => {
        if (img.width > 0) {
          setTutorialImage(selectedSight.referencePicture);
        } else {
          setTutorialImage(null);
        }
      };
      img.onerror = () => {
        setTutorialImage(null);
      };
    } else {
      setTutorialImage(null);
    }
  }, [sightTutorialFound, selectedSight]);

  if (enableSightTutorial === PhotoCaptureSightTutorialOption.DISABLED) {
    return null;
  }

  return (
    <div style={style.container}>
      <div style={styles['iconsContainer']}>
        <div style={styles['icon']}>
          <IconAroundVehicle
            size={80}
            orientationAngle={selectedSight.positioning?.orientation}
            positionAroundVehicle={selectedSight.positioning?.position}
            distance={selectedSight.positioning?.distance}
          />
        </div>
        <div style={styles['icon']}>
          <IconVerticalPosition
            size={67}
            position={selectedSight.positioning?.height}
            variant={IconVerticalPositionVariant.SECONDARY}
          />
        </div>
        <div style={styles['icon']}>
          <SightOverlay
            style={styles['sightIcon']}
            sight={selectedSight}
            getAttributes={style.sightIcon.getAttributes}
          />
        </div>
      </div>
      {enableSightTutorial === PhotoCaptureSightTutorialOption.CLASSIC && (
        <div style={style.classicTutorialContainer}>
          <div style={style.classicTitleContainer}>
            <Button style={styles['closeButtonFiller']} icon='close' variant='text'></Button>
            <span style={styles['classicTitle']}>
              {t('photo.hud.sightTutorial.tip').toUpperCase()}
            </span>
            <Button
              style={style.closeButton}
              primaryColor='text-black'
              icon='close'
              variant='text'
              onClick={onClose}
            />
          </div>
          <div style={style.classicGuidelineContainer}>
            <span style={style.classicGuideline}>
              {tutorialGuideline ?? t('photo.hud.sightTutorial.defaultTutorial')}
            </span>
          </div>
          {tutorialImage && (
            <div style={styles['classicImageContainer']}>
              <img style={styles['image']} src={tutorialImage} alt={selectedSight.id} />
            </div>
          )}
        </div>
      )}
      {enableSightTutorial === PhotoCaptureSightTutorialOption.MODERN && (
        <div style={style.tutorialContainer}>
          <div style={styles['titleContainer']}>
            <Button style={styles['closeButtonFiller']} icon='close' variant='text'></Button>
            <span>{t('photo.hud.sightTutorial.tip').toUpperCase()}</span>
            <Button
              style={style.closeButton}
              primaryColor='text-white'
              icon='close'
              variant='text'
              onClick={onClose}
            />
          </div>
          <div style={style.classicGuidelineContainer}>
            <span style={style.guideline}>
              {tutorialGuideline ?? t('photo.hud.sightTutorial.defaultTutorial')}
            </span>
          </div>
          {tutorialImage && (
            <div style={styles['imageContainer']}>
              <img style={styles['image']} src={tutorialImage} alt={selectedSight.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

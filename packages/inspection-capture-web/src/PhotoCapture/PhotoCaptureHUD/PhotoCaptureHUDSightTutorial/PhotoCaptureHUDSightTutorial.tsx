import { PhotoCaptureAppConfig, Sight } from '@monkvision/types';
import {
  Button,
  IconAroundVehicle,
  IconVerticalPosition,
  SightOverlay,
} from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@monkvision/common';
import { IconVerticalPositionVariant } from '@monkvision/common-ui-web/lib/components/IconVerticalPosition/IconVerticalPosition.types';
import {
  usePhotoCaptureHUDSightTutorialStyles,
  styles,
} from './PhotoCaptureHUDSightTutorial.styles';

/**
 * The props for the PhotoCaptureHUDSightTutorial component.
 */
export interface PhotoCaptureHUDSightTutorialProps
  extends Pick<PhotoCaptureAppConfig, 'sightTutorial'> {
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
}: PhotoCaptureHUDSightTutorialProps) {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const style = usePhotoCaptureHUDSightTutorialStyles(show);

  const sightTutorialFound = sightTutorial?.find((value) =>
    Object.keys(value.imageReferenceBySightId).includes(selectedSight.id),
  );
  const tutorialGuideline = sightTutorialFound?.[getLanguage(i18n.language)];

  let tutorialImage: string | null = null;
  if (sightTutorialFound && sightTutorialFound.imageReferenceBySightId[selectedSight.id]) {
    tutorialImage = sightTutorialFound.imageReferenceBySightId[selectedSight.id];
  } else if (selectedSight.referencePicture) {
    tutorialImage = selectedSight.referencePicture;
  }

  return (
    <div style={style.container}>
      <div style={styles['iconsContainer']}>
        <div style={styles['icon']}>
          <IconAroundVehicle
            size={80}
            orientationAngle={selectedSight.positioning?.orientation}
            positionAroundVehicle={selectedSight.positioning?.position}
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
      <div style={style.tutorialContainer}>
        <div style={styles['titleContainer']}>
          <Button style={styles['closeButtonFiller']} icon='close' variant='text'></Button>
          <span>{t('photo.hud.sightTutorial.tips').toUpperCase()}</span>
          <Button
            style={style.closeButton}
            primaryColor='text-white'
            icon='close'
            variant='text'
            onClick={onClose}
          />
        </div>
        <span style={style.guideline}>
          {tutorialGuideline ?? t('photo.hud.sightTutorial.defaultTutorial')}
        </span>
        {tutorialImage && (
          <div style={styles['imageContainer']}>
            <img style={styles['image']} src={tutorialImage} alt={selectedSight.id} />
          </div>
        )}
      </div>
    </div>
  );
}

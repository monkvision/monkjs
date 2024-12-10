import { useTranslation } from 'react-i18next';
import { IntroLayoutItem, VideoCaptureIntroLayout } from '../../VideoCaptureIntroLayout';

/**
 * Props accepted by the VideoCaptureTutorial component.
 */
export interface VideoCaptureTutorialProps {
  /**
   * Callback called when the user closes the tutorial by clicking on the confirm button.
   */
  onClose?: () => void;
}

/**
 * This component is a tutorial displayed on top of the camera when the user first starts the video capture.
 */
export function VideoCaptureTutorial({ onClose }: VideoCaptureTutorialProps) {
  const { t } = useTranslation();

  const confirmButtonProps = {
    onClick: onClose,
    children: t('video.tutorial.confirm'),
  };

  return (
    <VideoCaptureIntroLayout showBackdrop confirmButtonProps={confirmButtonProps}>
      <IntroLayoutItem
        icon='car-arrow'
        title={t('video.tutorial.start.title')}
        description={t('video.tutorial.start.description')}
      />
      <IntroLayoutItem
        icon='360'
        title={t('video.tutorial.finish.title')}
        description={t('video.tutorial.finish.description')}
      />
      <IntroLayoutItem
        icon='circle-dot'
        title={t('video.tutorial.photos.title')}
        description={t('video.tutorial.photos.description')}
      />
    </VideoCaptureIntroLayout>
  );
}

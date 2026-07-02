import { useTranslation } from 'react-i18next';
import { Button } from '@monkvision/common-ui-web';
import { MonkE2eId } from '@monkvision/types';
import { styles } from './VideoCaptureComplete.styles';

/**
 * Props accepted by the VideoCaptureComplete component.
 */
export interface VideoCaptureCompleteProps {
  onComplete?: () => void;
}

/**
 * Component displayed a transition between the video capture and the photo capture, to let the user
 * know that the video has been successfully captured.
 */
export function VideoCaptureComplete({ onComplete }: VideoCaptureCompleteProps) {
  const { t } = useTranslation();
  return (
    <div style={styles['container']}>
      <div style={styles['title']}>{t('video.complete.title')}</div>
      <div style={styles['text']}>{t('video.complete.text')}</div>
      <Button onClick={onComplete} data-e2e={MonkE2eId.VIDEO_CAPTURE_PROCEED}>
        {t('video.complete.button')}
      </Button>
    </div>
  );
}

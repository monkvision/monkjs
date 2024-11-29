import { useTranslation } from 'react-i18next';
import { VideoCapture } from '@monkvision/inspection-capture-web';
import styles from './VideoCapturePage.module.css';

export function VideoCapturePage() {
  const { i18n } = useTranslation();

  return (
    <div className={styles['container']}>
      <VideoCapture lang={i18n.language} />
    </div>
  );
}

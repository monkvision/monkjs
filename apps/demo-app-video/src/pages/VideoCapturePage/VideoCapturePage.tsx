import { useTranslation } from 'react-i18next';
import { VideoCapture } from '@monkvision/inspection-capture-web';
import { useMonkAppState } from '@monkvision/common';
import { CaptureWorkflow } from '@monkvision/types';
import styles from './VideoCapturePage.module.css';

export function VideoCapturePage() {
  const { i18n } = useTranslation();
  const { config } = useMonkAppState({
    requireWorkflow: CaptureWorkflow.VIDEO,
  });

  return (
    <div className={styles['container']}>
      <VideoCapture
        {...config}
        apiConfig={{
          authToken: 'test',
          apiDomain: 'test',
          thumbnailDomain: 'test',
        }}
        inspectionId='test'
        lang={i18n.language}
      />
    </div>
  );
}

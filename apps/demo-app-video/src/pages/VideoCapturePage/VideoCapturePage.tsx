import { useTranslation } from 'react-i18next';
import { VideoCapture } from '@monkvision/inspection-capture-web';
import { useMonkAppState } from '@monkvision/common';
import { CaptureWorkflow } from '@monkvision/types';
import { useNavigate } from 'react-router-dom';
import { Page } from '../pages';
import styles from './VideoCapturePage.module.css';

export function VideoCapturePage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { config, authToken, inspectionId } = useMonkAppState({
    requireInspection: true,
    requireWorkflow: CaptureWorkflow.VIDEO,
  });

  const handleComplete = () => {
    navigate(Page.INSPECTION_COMPLETE);
  };

  return (
    <div className={styles['container']}>
      <VideoCapture
        {...config}
        apiConfig={{
          authToken,
          apiDomain: config.apiDomain,
          thumbnailDomain: config.thumbnailDomain,
        }}
        inspectionId={inspectionId}
        onComplete={handleComplete}
        lang={i18n.language}
      />
    </div>
  );
}

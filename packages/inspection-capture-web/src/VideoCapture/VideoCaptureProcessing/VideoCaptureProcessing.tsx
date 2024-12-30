import { useTranslation } from 'react-i18next';
import { ButtonProps } from '@monkvision/common-ui-web';
import { VideoCaptureProcessingProps } from './VideoCaptureProcessing.types';
import { VideoCapturePageLayout } from '../VideoCapturePageLayout';
import { styles, useVideoCaptureProcessingStyles } from './VideoCaptureProcessing.styles';

function getLabel(processingProgress: number, uploadingProgress: number): string {
  if (processingProgress < 1) {
    return 'video.processing.processing';
  }
  return uploadingProgress < 1 ? 'video.processing.uploading' : 'video.processing.success';
}

/**
 * Component displayed at the end of the VideoCapture process, used to display progress indicators for the processing
 * and uploading of video frames.
 */
export function VideoCaptureProcessing({
  processedFrames,
  totalProcessingFrames,
  uploadedFrames,
  totalUploadingFrames,
  onComplete,
}: VideoCaptureProcessingProps) {
  const processingProgress = processedFrames / totalProcessingFrames;
  const uploadingProgress = uploadedFrames / totalUploadingFrames;
  const progress = processingProgress < 1 ? processingProgress : uploadingProgress;
  const { t } = useTranslation();
  const { containerStyle, progressBarContainerStyle, progressBarStyle } =
    useVideoCaptureProcessingStyles(progress);

  const confirmButtonProps: ButtonProps = {
    onClick: onComplete,
    disabled: processingProgress < 1 || uploadingProgress < 1,
    children: t('video.processing.done'),
  };

  return (
    <VideoCapturePageLayout showBackdrop showTitle={false} confirmButtonProps={confirmButtonProps}>
      <div style={containerStyle}>
        <div style={styles['labelContainer']}>
          <div>{t(getLabel(processingProgress, uploadingProgress))}</div>
          <div>{Math.floor(progress * 100)}%</div>
        </div>
        <div style={progressBarContainerStyle}>
          <div style={progressBarStyle} data-testid='progress-bar' />
        </div>
      </div>
    </VideoCapturePageLayout>
  );
}

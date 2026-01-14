import { useTranslation } from 'react-i18next';
import { Button } from '@monkvision/common-ui-web';
import { useMonkTheme } from '@monkvision/common';
import { useDownloadImages } from './hooks/useDownloadImages';
import { styles } from './DownloadImagesButton.styles';
import { DownloadImagesButtonProps } from '../types/download-images.types';

/**
 * The DownloadImagesButton component that provides a button to download images from the inspection review.
 */
export function DownloadImagesButton(props: DownloadImagesButtonProps) {
  const { palette } = useMonkTheme();
  const { t } = useTranslation();
  const { loading, handleDownloadImages } = useDownloadImages(props);

  return (
    <Button
      onClick={handleDownloadImages}
      icon='file-download'
      loading={loading}
      variant='text'
      primaryColor={palette.text.white}
      style={styles['downloadImagesButton']}
    >
      {t('actionButtons.downloadPictures')}
    </Button>
  );
}

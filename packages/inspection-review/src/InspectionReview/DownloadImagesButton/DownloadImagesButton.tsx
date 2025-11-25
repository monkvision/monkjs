import { Button } from '@monkvision/common-ui-web';
import { useLoadingState, useMonkTheme } from '@monkvision/common';
import { useTranslation } from 'react-i18next';

/**
 * The DownloadImagesButton component that provides a button to download images from the inspection review.
 */
export function DownloadImagesButton() {
  const { palette } = useMonkTheme();
  const { t } = useTranslation();
  const loading = useLoadingState();

  const handleDownloadPictures = () => {
    loading.start();
    console.log('Download pictures clicked');
    loading.onSuccess();
  };

  return (
    <Button
      onClick={handleDownloadPictures}
      icon='file-download'
      loading={loading}
      variant='text'
      primaryColor={palette.text.black}
    >
      {t('inspectionReview.downloadPictures').toUpperCase()}
    </Button>
  );
}

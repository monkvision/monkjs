import { useLoadingState, useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { styles } from './DocumentActions.styles';

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
      style={styles['downloadPicturesButton']}
    >
      {t('inspectionReview.downloadPictures').toUpperCase()}
    </Button>
  );
}

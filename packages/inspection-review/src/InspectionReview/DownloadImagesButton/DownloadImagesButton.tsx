import { Button } from '@monkvision/common-ui-web';
import { useMonkTheme } from '@monkvision/common';
import { useDownloadImages } from './hooks/useDownloadImages';

/**
 * The DownloadImagesButton component that provides a button to download images from the inspection review.
 */
export function DownloadImagesButton() {
  const { palette } = useMonkTheme();
  const { loading, handleDownloadPictures } = useDownloadImages();

  return (
    <Button
      onClick={handleDownloadPictures}
      icon='file-download'
      loading={loading}
      variant='text'
      primaryColor={palette.text.black}
    >
      DOWNLOAD PICTURES
    </Button>
  );
}

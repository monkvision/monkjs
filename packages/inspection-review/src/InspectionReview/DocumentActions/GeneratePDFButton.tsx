import { useLoadingState, useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { styles } from './DocumentActions.styles';

export function GeneratePDFButton() {
  const { palette } = useMonkTheme();
  const { t } = useTranslation();
  const loading = useLoadingState();

  const handleGeneratePdf = () => {
    loading.start();
    console.log('Generate PDF clicked');
    loading.onSuccess();
  };

  return (
    <Button
      onClick={handleGeneratePdf}
      loading={loading}
      variant='outline'
      primaryColor={palette.text.white}
      secondaryColor={palette.secondary.xdark}
      style={styles['pdfButton']}
    >
      {t('inspectionReview.generatePdf').toUpperCase()}
    </Button>
  );
}

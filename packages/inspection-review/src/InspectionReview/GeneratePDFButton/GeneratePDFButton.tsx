import { useTranslation } from 'react-i18next';
import { useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { useGeneratePDF } from './hooks/useGeneratePDF';
import { GeneratePDFButtonProps } from '../types';
import { styles } from './GeneratePDFButton.styles';

/**
 * The GeneratePDFButton component that allows users to generate a PDF report of the inspection.
 */
export function GeneratePDFButton(props: GeneratePDFButtonProps) {
  const { palette } = useMonkTheme();
  const { t } = useTranslation();
  const { loading, handleGeneratePdf } = useGeneratePDF(props);

  return (
    <Button
      onClick={handleGeneratePdf}
      loading={loading}
      variant='outline'
      primaryColor={palette.text.white}
      secondaryColor={palette.secondary.xdark}
      style={styles['pdfButton']}
    >
      {t('actionButtons.generatePdf')}
    </Button>
  );
}

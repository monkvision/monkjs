import { useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { useGeneratePDF } from './hooks/useGeneratePDF';
import { GeneratePDFButtonProps } from '../types';

/**
 * The GeneratePDFButton component that allows users to generate a PDF report of the inspection.
 */
export function GeneratePDFButton(props: GeneratePDFButtonProps) {
  const { palette } = useMonkTheme();
  const { loading, handleGeneratePdf } = useGeneratePDF(props);

  return (
    <Button
      onClick={handleGeneratePdf}
      loading={loading}
      variant='outline'
      primaryColor={palette.text.white}
      secondaryColor={palette.secondary.xdark}
    >
      GENERATE PDF
    </Button>
  );
}

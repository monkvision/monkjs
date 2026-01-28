import { useLoadingState, useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';

/**
 * Props accepted by the GeneratePDFButton component.
 */
export interface GeneratePDFButtonProps {
  /**
   * Callback function triggered when the PDF generation is requested.
   */
  onDownloadPDF?: () => void;
}

/**
 * The GeneratePDFButton component that allows users to generate a PDF report of the inspection.
 */
export function GeneratePDFButton(props: GeneratePDFButtonProps) {
  const { palette } = useMonkTheme();
  const loading = useLoadingState();

  const handleGeneratePdf = () => {
    if (props.onDownloadPDF) {
      props.onDownloadPDF();
    } else {
      defaultPdfGeneration();
    }
  };

  function defaultPdfGeneration() {
    loading.start();
    console.log('Generate PDF clicked');
    loading.onSuccess();
  }

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

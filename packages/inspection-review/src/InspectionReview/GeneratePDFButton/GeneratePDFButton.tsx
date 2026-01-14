import { useLoadingState, useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';

/**
 * The GeneratePDFButton component that allows users to generate a PDF report of the inspection.
 */
export function GeneratePDFButton() {
  const { palette } = useMonkTheme();
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
    >
      GENERATE PDF
    </Button>
  );
}

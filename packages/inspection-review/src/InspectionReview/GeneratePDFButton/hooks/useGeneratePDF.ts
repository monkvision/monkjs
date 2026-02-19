import { useLoadingState, useObjectMemo } from '@monkvision/common';
import { GeneratePDFButtonProps } from '../../types';

/**
 * State and handlers for generating PDF.
 */
export interface GeneratePDFState {
  /**
   * Loading state for the PDF generation process.
   */
  loading: ReturnType<typeof useLoadingState>;
  /**
   * Handler function to initiate PDF generation.
   */
  handleGeneratePdf: () => void;
}

/**
 * State and handlers for generating PDF.
 */
export function useGeneratePDF(props: GeneratePDFButtonProps): GeneratePDFState {
  const loading = useLoadingState();

  const defaultPdfGeneration = () => {
    loading.start();
    console.log('Generate PDF clicked');
    loading.onSuccess();
  };

  const handleGeneratePdf = () => {
    if (props.onDownloadPDF) {
      props.onDownloadPDF();
    } else {
      defaultPdfGeneration();
    }
  };

  return useObjectMemo({
    handleGeneratePdf,
    loading,
  });
}

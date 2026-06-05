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
  handleGeneratePdf?: () => void;
}

/**
 * State and handlers for generating PDF.
 */
export function useGeneratePDF(props: GeneratePDFButtonProps): GeneratePDFState {
  const loading = useLoadingState();

  const defaultPdfGeneration = () => {
    console.log('Generate PDF clicked');
  };

  const handleGeneratePdf = () => {
    loading.start();

    try {
      if (props.onDownloadPDF) {
        props.onDownloadPDF();
      } else {
        defaultPdfGeneration();
      }
    } finally {
      loading.onSuccess();
    }
  };

  return useObjectMemo({
    handleGeneratePdf,
    loading,
  });
}

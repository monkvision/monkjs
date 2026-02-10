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

  const handleGeneratePdf = () => {
    loading.start();

    try {
      props.onDownloadPDF?.();
    } finally {
      loading.onSuccess();
    }
  };

  return useObjectMemo({
    handleGeneratePdf,
    loading,
  });
}

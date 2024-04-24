import { useTranslation } from 'react-i18next';

export interface UseInspectionGalleryEmptyLabelParams {
  captureMode: boolean;
  isFilterActive: boolean;
}

export function useInspectionGalleryEmptyLabel({
  captureMode,
  isFilterActive,
}: UseInspectionGalleryEmptyLabelParams): string {
  const { t } = useTranslation();
  if (isFilterActive) {
    return t('list.empty.filter');
  }
  return captureMode ? t('list.empty.capture') : t('list.empty.nonCapture');
}

import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getLanguage, useLoadingState } from '@monkvision/common';
import { DownloadImagesButtonProps } from '../../../types/download-images.types';
import { useInspectionReviewProvider } from '../../../hooks';

function transformToKebabCase(input: string): string {
  return input
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/**
 * State and handlers for downloading images.
 */
export interface DownloadImagesState {
  /**
   * Loading state for the image downloading process.
   */
  loading: ReturnType<typeof useLoadingState>;
  /**
   * Handler function to initiate image download.
   */
  handleDownloadImages: () => void;
}

/**
 * State and handlers for downloading images.
 */
export function useDownloadImages(props: DownloadImagesButtonProps): DownloadImagesState {
  const { allGalleryItems, inspection, additionalInfo } = useInspectionReviewProvider();
  const { i18n } = useTranslation();
  const loading = useLoadingState();

  const defaultDownloadImages = async () => {
    const promises = allGalleryItems.map(async ({ image }) => {
      const res = await fetch(image.path);
      if (!res.ok) {
        throw new Error(`Failed to fetch image (HTTP ${res.status}): ${image.path}`);
      }
      const blob = await res.blob();
      if (!blob || blob.size === 0) {
        throw new Error(`Empty blob received for image: ${image.path}`);
      }
      return { blob, label: image.label?.[getLanguage(i18n.language)] };
    });

    const res = await Promise.all(promises);
    const zip = new JSZip();

    const usedFileNameCounts = new Map<string, number>();
    res.forEach(({ blob, label }, index) => {
      const baseName = label ? transformToKebabCase(label) : `${index}`;
      const occurrence = usedFileNameCounts.get(baseName) ?? 0;
      usedFileNameCounts.set(baseName, occurrence + 1);
      const fileName = occurrence === 0 ? baseName : `${baseName}-${occurrence}`;
      zip.file(`${fileName}.jpg`, blob);
    });

    const zipFile = await zip.generateAsync({ type: 'blob' });
    const zipFileName =
      additionalInfo?.['vin'] || additionalInfo?.['VIN'] || inspection?.id || 'inspection-images';
    saveAs(zipFile, `${zipFileName}.zip`);
  };

  const handleDownloadImages = () => {
    loading.start();

    try {
      if (props.onDownloadImages) {
        props.onDownloadImages(allGalleryItems);
      } else {
        defaultDownloadImages();
      }
    } finally {
      loading.onSuccess();
    }
  };

  return {
    loading,
    handleDownloadImages,
  };
}

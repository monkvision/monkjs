import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useThumbnail({
  colors,
  isPending, isComplianceFailed, isComplianceIdle, isComplianceUnknown, isUploadFailed,
  handleReupload, handleRecheck, handleRetake,
}) {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    if (isPending) { return { callback: null, color: colors.placeholder }; }
    if (isUploadFailed) {
      return {
        label: t('uploadCenter.variant.reupload.label'),
        icon: 'refresh-circle',
        callback: handleReupload,
        sublable: t('uploadCenter.variant.reupload.sublabel'),
        color: colors.error,
      };
    }
    if (isComplianceIdle) {
      return {
        label: t('uploadCenter.variant.inQueue.label'),
        icon: 'clock',
        callback: null,
        color: colors.disabled,
      };
    }
    if (isComplianceFailed || isComplianceUnknown) {
      return {
        label: t('uploadCenter.variant.recheck.label'),
        icon: 'alert-circle',
        callback: handleRecheck,
        sublable: t('uploadCenter.variant.recheck.sublabel'),
        color: colors.disabled,
      };
    }

    return {
      label: t('uploadCenter.variant.retake.label'),
      icon: 'camera-retake',
      callback: handleRetake,
      sublable: t('uploadCenter.variant.retake.sublabel'),
      color: colors.accent,
    };
  }, [isPending, isComplianceFailed, isComplianceIdle, isUploadFailed,
    handleReupload, handleRecheck, handleRetake, colors, i18n.language]);
}

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useThumbnail({
  colors,
  isPending, isComplianceFailed, isComplianceIdle, isComplianceUnknown, isUploadFailed,
  handleReupload, handleRecheck, handleRetake,
}) {
  const { t } = useTranslation();

  return useMemo(() => {
    if (isPending) { return { callback: null, color: colors.placeholder }; }
    if (isUploadFailed) {
      return {
        label: t('uploadCenter.variant.retake.label'),
        icon: 'camera-retake',
        callback: handleRetake,
        sublabel: t('uploadCenter.variant.retake.sublabel'),
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
        sublabel: t('uploadCenter.variant.recheck.sublabel'),
        color: colors.disabled,
      };
    }

    return {
      label: t('uploadCenter.variant.retake.label'),
      icon: 'camera-retake',
      callback: handleRetake,
      sublabel: t('uploadCenter.variant.retake.sublabel'),
      color: colors.accent,
    };
  }, [isPending, isComplianceFailed, isComplianceIdle, isUploadFailed,
    handleReupload, handleRecheck, handleRetake, colors]);
}

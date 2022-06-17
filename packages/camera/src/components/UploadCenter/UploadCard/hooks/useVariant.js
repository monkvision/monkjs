import { useMemo } from 'react';

export default function useThumbnail({
  colors,
  isPending, isComplianceFailed, isComplianceIdle, isComplianceUnknown, isUploadFailed,
  handleReupload, handleRecheck, handleRetake,
}) {
  return useMemo(() => {
    if (isPending) { return { callback: null, color: colors.placeholder }; }
    if (isUploadFailed) {
      return {
        label: 'Reupload picture',
        icon: 'refresh-circle',
        callback: handleReupload,
        sublable: 'press here to reupload...',
        color: colors.error,
      };
    }
    if (isComplianceIdle) {
      return {
        label: 'In queue',
        icon: 'clock',
        callback: null,
        color: colors.disabled,
      };
    }
    if (isComplianceFailed || isComplianceUnknown) {
      return {
        label: 'Recheck picture',
        icon: 'alert-circle',
        callback: handleRecheck,
        sublable: 'press here to recheck...',
        color: colors.disabled,
      };
    }

    return {
      label: 'Retake picture',
      icon: 'camera-retake',
      callback: handleRetake,
      sublable: 'press here to retake...',
      color: colors.accent,
    };
  }, [isPending, isComplianceFailed, isComplianceIdle, isUploadFailed,
    handleReupload, handleRecheck, handleRetake, colors]);
}

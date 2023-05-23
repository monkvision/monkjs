import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const validErrorCodes = [
  'UNKNOWN_SIGHT',
  'INTERIOR_NOT_SUPPORTED',
  'NO_CAR_BODY',
  'UNKNOWN_VIEWPOINT',
  'WRONG_ANGLE',
  'WRONG_CENTER_PART',
  'MISSING_PARTS',
  'HIDDEN_PARTS',
  'TOO_ZOOMED',
  'NOT_ZOOMED_ENOUGH',
];

export default function useSubtitle({
  isComplianceUnknown,
  isComplianceIdle,
  isPending,
  isUploadFailed,
  compliance,
}) {
  const { t } = useTranslation();

  return useMemo(() => {
    if (isComplianceUnknown) { return t('uploadCenter.subtitle.unknown'); }
    if (isPending) { return t('uploadCenter.subtitle.pending'); }
    if (isUploadFailed) { return t('uploadCenter.subtitle.failed'); }
    if (isComplianceIdle) { return t('uploadCenter.subtitle.idle'); }

    if (compliance.result) {
      const {
        image_quality_assessment: iqa,
        coverage_360: carCov,
      } = compliance.result.data.compliances;

      const badQuality = iqa && !iqa.is_compliant;
      const badCoverage = carCov && !carCov.is_compliant;

      const reasons = [];

      if (badQuality && iqa.reasons) {
        iqa.reasons.forEach((reason, index) => {
          const first = index === 0;
          reasons.push(first ? t(`uploadCenter.subtitle.reasons.${reason}`)
            : `${t('uploadCenter.subtitle.reasonsJoin')} ${t(`uploadCenter.subtitle.reasons.${reason}`)}`);
        });
      }

      if (badCoverage && carCov.reasons) {
        carCov.reasons.forEach((reason, index) => {
          const first = index === 0 && !badQuality;
          const errorCode = validErrorCodes.find((code) => reason.startsWith(code));
          // display all reasons expect `UNKNOWN_SIGHT`
          if (errorCode && errorCode !== 'UNKNOWN_SIGHT') {
            reasons.push(first ? t(`uploadCenter.subtitle.reasons.${errorCode}`)
              : `${t('uploadCenter.subtitle.reasonsJoin')} ${t(`uploadCenter.subtitle.reasons.${errorCode}`)}`);
          }
        });
      }

      if (reasons.length > 0) {
        return `${t('uploadCenter.subtitle.reasonsStart')} ${reasons.join(' ')}`;
      }
    }

    return t('uploadCenter.subtitle.queueBlocked');
  }, [compliance.result, isPending, isUploadFailed, isComplianceIdle, isComplianceUnknown]);
}

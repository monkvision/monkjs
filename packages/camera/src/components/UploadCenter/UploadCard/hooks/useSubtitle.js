import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const UNKNOWN_SIGHT_REASON = 'UNKNOWN_SIGHT--unknown sight';

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
          // display all reasons expect `UNKNOWN_SIGHT`
          if (reason !== UNKNOWN_SIGHT_REASON) {
            reasons.push(first ? t(`uploadCenter.subtitle.reasons.${reason}`)
              : `${t('uploadCenter.subtitle.reasonsJoin')} ${t(`uploadCenter.subtitle.reasons.${reason}`)}`);
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

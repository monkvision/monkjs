import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const translatedErrorCodes = [
  'BLURRINESS',
  'UNDEREXPOSURE',
  'OVEREXPOSURE',
  'TOO_ZOOMED',
  'NOT_ZOOMED_ENOUGH',
  'WRONG_ANGLE',
  'UNKNOWN_VIEWPOINT',
  'WRONG_CENTER_PART',
  'MISSING_PARTS',
  'HIDDEN_PARTS',
  'UNKNOWN_SIGHT',
  'INTERIOR_NOT_SUPPORTED',
];

function getSubtitle(reasons, t) {
  if (reasons.length === 0) {
    return t('uploadCenter.subtitle.unknown');
  }
  const translatedReasons = reasons.map((reason) => {
    const key = translatedErrorCodes
      .find((errorCode) => reason.toUpperCase().startsWith(errorCode));
    return key ? t(`uploadCenter.subtitle.reasons.${key}`) : `[MISSING TRANSLATION : ${reason}]`;
  });
  const joinedReasons = translatedReasons.join(`${t('uploadCenter.subtitle.reasonsJoin')} `);
  return `${t('uploadCenter.subtitle.reasonsStart')} ${joinedReasons}`;
}

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
        reasons.push(...iqa.reasons);
      }

      if (badCoverage && carCov.reasons) {
        reasons.push(...carCov.reasons);
      }

      return getSubtitle(reasons, t);
    }

    return t('uploadCenter.subtitle.queueBlocked');
  }, [compliance.result, isPending, isUploadFailed, isComplianceIdle, isComplianceUnknown]);
}

import { useMemo } from 'react';
import texts from '../texts';

const UNKNOWN_SIGHT_REASON = 'UNKNOWN_SIGHT--unknown sight';

export default function useSubtitle({
  isComplianceUnknown, isComplianceIdle, isPending, isUploadFailed, compliance }) {
  return useMemo(() => {
    if (isComplianceUnknown) { return 'Couldn\'t check the image quality'; }
    if (isPending) { return `Loading...`; }
    if (isUploadFailed) { return `We couldn't upload this image, please reupload`; }
    if (isComplianceIdle) { return 'In the image quality check queue...'; }

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
          reasons.push(first ? texts[reason] : `and ${texts[reason]}`);
        });
      }

      if (badCoverage && carCov.reasons) {
        carCov.reasons.forEach((reason, index) => {
          const first = index === 0 && !badQuality;
          // display all reasons expect `UNKNOWN_SIGHT`
          if (reason !== UNKNOWN_SIGHT_REASON) { reasons.push(first ? texts[reason] : `and ${texts[reason]}`); }
        });
      }

      if (reasons.length > 0) {
        return `This image ${reasons.join(' ')}`;
      }
    }

    return 'We couldn\'t check the image quality (queue blocked)';
  }, [compliance.result, isPending, isUploadFailed, isComplianceIdle, isComplianceUnknown]);
}

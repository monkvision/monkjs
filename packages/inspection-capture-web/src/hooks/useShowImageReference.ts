import { useMonkState, useObjectMemo } from '@monkvision/common';
import { CAR_COVERAGE_COMPLIANCE_ISSUES, Sight } from '@monkvision/types';
import { useEffect, useMemo, useState } from 'react';

/* Parameters for the useShowImageReference hook. */
export interface UseShowImageReferenceParams {
  /** The current sight. */
  sight: Sight;
  /** Callback called if an image is not compliant. */
  toggleSightTutorial: () => void;
}

/* Hook to display the tutorial if the current sight is for non-compliant. */
export function useShowImageReference({ sight, toggleSightTutorial }: UseShowImageReferenceParams) {
  const { state } = useMonkState();
  const [isMounted, setIsMounted] = useState(false);

  /* Allow time for the Sights Slider animation to finish */
  useEffect(() => {
    setTimeout(() => setIsMounted(true), 1000);
  }, []);

  const hasCarCoverageComplianceIssues = useMemo(() => {
    return state.images.some((image) => {
      return (
        image.sightId === sight.id &&
        image.complianceIssues &&
        image.complianceIssues.some((issue) => CAR_COVERAGE_COMPLIANCE_ISSUES.includes(issue))
      );
    });
  }, [sight, state.images]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (hasCarCoverageComplianceIssues) {
      toggleSightTutorial();
    }
  }, [isMounted, sight, hasCarCoverageComplianceIssues]);

  return useObjectMemo({
    hasCarCoverageComplianceIssues,
  });
}

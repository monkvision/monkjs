import { useMemo } from 'react';

export default function useMixedStates({ state, sights, ids }) {
  const hasPendingComplianceAndNoRejectedUploads = useMemo(
    () => (state.hasPendingCompliance
      || state.unfulfilledComplianceIds?.length) && !state.uploadIdsWithError?.length,
    [state.hasPendingCompliance, state.unfulfilledComplianceIds, state.uploadIdsWithError],
  );

  const hasTooMuchTodoCompliances = useMemo(
    () => state.notReadyCompliance?.length > sights.state.tour.length * 0.2,
    [sights.state.tour, state.notReadyCompliance],
  );

  const hasFulfilledAllUploads = useMemo(
    () => state.unfulfilledUploadIds.length === 0,
    [state.unfulfilledUploadIds],
  );

  const hasNoCompliancesLeft = useMemo(
    () => !state.hasPendingCompliance && ids && ids.length === 0,
    [ids, state.hasPendingCompliance],
  );

  const hasAllRejected = useMemo(
    () => state.uploadIdsWithError.length === sights.state.tour.length,
    [sights.state.tour, state.uploadIdsWithError],
  );

  return {
    hasPendingComplianceAndNoRejectedUploads,
    hasTooMuchTodoCompliances,
    hasFulfilledAllUploads,
    hasNoCompliancesLeft,
    hasAllRejected,
  };
}

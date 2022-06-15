import { useCallback, useMemo } from 'react';

const getIndexById = (id, array) => array.findIndex((item) => item.id === id);
const hasTodo = (c) => c?.is_compliant === null || c?.status === 'TODO';

const compliant = { is_compliant: true, reasons: [] };
const UNKNOWN_SIGHT_REASON = 'UNKNOWN_SIGHT--unknown sight';

export default function useComplianceIds({ sights, compliance, uploads, navigationOptions }) {
  const sortByIndex = useCallback((a, b) => {
    const indexA = getIndexById(a.id, sights.state.tour);
    const indexB = getIndexById(b.id, sights.state.tour);

    return indexB - indexA;
  }, [sights.state.tour]);

  const fulfilledCompliance = useMemo(() => Object.values(compliance.state)
    .filter(({ status }) => status === 'fulfilled')
    .map(({ result, requestCount, ...item }) => {
      const carCov = result.data.compliances.coverage_360;
      const iqa = result.data.compliances.image_quality_assessment;

      // `handleChangeReasons` returns the full result object with the given compliances
      const handleChangeReasons = (compliances) => ({
        ...item,
        requestCount,
        result: { ...result,
          data: {
            ...result.data, compliances: { ...result.data.compliances, ...compliances } } } });

      const hasReachedMaxRetries = requestCount >= 2;

      // Mark as compliant compliances with status TODO and a request count >=2
      if (hasReachedMaxRetries && (hasTodo(carCov) || hasTodo(iqa))) {
        return handleChangeReasons({
          coverage_360: hasTodo(carCov) ? { ...carCov, ...compliant } : carCov,
          image_quality_assessment: hasTodo(iqa) ? { ...iqa, ...compliant } : iqa,
        });
      }

      // if no carcov reasons, we change nothing
      if (!carCov?.reasons) { return { ...item, requestCount, result }; }

      // remove the UNKNOWN_SIGHT from the carCov reasons array
      const newCarCovReasons = carCov.reasons?.filter((reason) => reason !== UNKNOWN_SIGHT_REASON);
      return handleChangeReasons({
        coverage_360: { reasons: newCarCovReasons, is_compliant: !newCarCovReasons.length },
      });
    }), [compliance]);

  const unfulfilledUploadIds = useMemo(() => Object.values(uploads.state)
    .filter(({ status }) => ['pending', 'idle'].includes(status))
    .sort(sortByIndex)
    .map(({ id }) => id), [sortByIndex, uploads.state]);

  const unfulfilledComplianceIds = useMemo(() => Object.values(compliance.state)
    .filter(({ status, requestCount }) => {
      const isPendingAndHasNotReachedMaxRetries = ['pending', 'idle'].includes(status) && requestCount <= navigationOptions.retakeMaxTry;
      const unfulfilled = status === 'rejected';

      return isPendingAndHasNotReachedMaxRetries || unfulfilled;
    })
    .sort(sortByIndex)
    .map(({ id }) => id), [compliance.state, navigationOptions.retakeMaxTry, sortByIndex]);

  const uploadIdsWithError = useMemo(() => Object.values(uploads.state)
    .filter(({ status, error }) => (status === 'rejected' || error !== null))
    .sort(sortByIndex)
    .map(({ id }) => id), [sortByIndex, uploads.state]);

  const complianceIdsWithError = useMemo(() => {
    if (fulfilledCompliance) {
      return Object.values(fulfilledCompliance)
        .filter((item) => {
          if (item.requestCount > navigationOptions.retakeMaxTry || item.status !== 'fulfilled') {
            return false;
          }

          const {
            image_quality_assessment: iqa,
            coverage_360: carCov,
          } = item.result.data.compliances;
          const badQuality = iqa && !iqa.is_compliant;
          const badCoverage = carCov && !carCov.is_compliant;

          return badQuality || badCoverage;
        })
        .sort(sortByIndex)
        .map(({ id }) => id);
    }
    return [];
  }, [fulfilledCompliance, navigationOptions.retakeMaxTry, sortByIndex]);

  const hasPendingCompliance = useMemo(() => Object.values(compliance.state)
    .some(({ status, result, requestCount }) => {
      if (status === 'pending') { return true; }
      if (status !== 'fulfilled') { return false; }

      const currentCompliance = result.data.compliances;
      const hasNotReadyCompliances = Object.values(currentCompliance).some(
        (c) => c.is_compliant === null,
      );

      return hasNotReadyCompliances && requestCount <= 1;
    }), [compliance.state]);

  const notReadyCompliance = useMemo(() => Object.values(compliance.state)
    .filter(({ result }) => {
      if (!result) { return false; }
      const currentCompliance = result.data.compliances;
      const hasNotReadyCompliances = Object.values(currentCompliance).some(
        (c) => c.is_compliant === null,
      );

      return hasNotReadyCompliances;
    }), [compliance.state]);

  return { ids: [...new Set([
    ...unfulfilledUploadIds,
    ...unfulfilledComplianceIds,
    ...uploadIdsWithError,
    ...complianceIdsWithError,
  ])],
  state: {
    uploads,
    compliance,
    unfulfilledUploadIds,
    unfulfilledComplianceIds,
    uploadIdsWithError,
    complianceIdsWithError,
    hasPendingCompliance,
    notReadyCompliance,
  } };
}

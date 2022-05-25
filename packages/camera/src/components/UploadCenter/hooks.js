import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStartUploadAsync } from '../Capture/hooks';
import Actions from '../../actions';

const getIndexById = (id, array) => array.findIndex((item) => item.id === id);
const getItemById = (id, array) => array.find((item) => item.id === id);
const hasTodo = (c) => c?.is_compliant === null || c?.status === 'TODO';

const compliant = { is_compliant: true, reasons: [] };
const UNKNOWN_SIGHT_REASON = 'UNKNOWN_SIGHT--unknown sight';

export const useComplianceIds = ({ sights, compliance, uploads, navigationOptions }) => {
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
    .filter(({ status, requestCount, result }) => {
      const currentCompliance = result?.data?.compliances;
      const hasNullCompliances = result && Object.values(currentCompliance).some((c) => hasTodo(c));

      const hasTodoCompliancesAndNotReachedMaxRetries = hasNullCompliances && requestCount < 2;
      const isPendingAndHasNotReachedMaxRetries = ['pending', 'idle'].includes(status) && requestCount <= navigationOptions.retakeMaxTry;

      return isPendingAndHasNotReachedMaxRetries || hasTodoCompliancesAndNotReachedMaxRetries;
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
    .some(({ result, requestCount }) => {
      if (!result) { return true; }
      const currentCompliance = result.data.compliances;
      const hasNotReadyCompliances = Object.values(currentCompliance).some(
        (c) => c.is_compliant === null,
      );

      return hasNotReadyCompliances && requestCount < 2;
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
    unfulfilledUploadIds,
    unfulfilledComplianceIds,
    uploadIdsWithError,
    complianceIdsWithError,
    hasPendingCompliance,
    notReadyCompliance,
  } };
};

export const useHandlers = ({
  inspectionId,
  task,
  onRetakeAll,
  checkComplianceAsync,
  ids,
  mapTasksToSights,
  ...states
}) => {
  const { sights, compliance, uploads } = states;
  const [complianceToCheck, setComplianceToCheck] = useState([]);

  const uploadParams = { inspectionId, sights, uploads, mapTasksToSights, task };
  const startUploadAsync = useStartUploadAsync(uploadParams);

  // retake all rejected/non-compliant pictures at once
  const handleRetakeAll = useCallback(() => {
    // adding an initialState that will hold new compliances with `requestCount = 1`
    const complianceInitialState = { id: '', status: 'idle', error: null, requestCount: 1, result: null, imageId: null };
    const complianceState = {};
    ids.forEach((id) => { complianceState[id] = { ...complianceInitialState, id }; });

    // reset uploads state with the new incoming ones
    uploads.dispatch({ type: Actions.uploads.RESET_UPLOADS, ids: { sightIds: ids } });

    // reset sightrs state with the new incoming ones
    sights.dispatch({ type: Actions.sights.RESET_TOUR, payload: { sightIds: ids } });

    // run a custom callback at the retake all time
    onRetakeAll();
  }, [ids, onRetakeAll, sights, uploads]);

  // retake one picture
  const handleRetake = useCallback((id) => {
    // reset upload and compliance info
    compliance.dispatch({
      type: Actions.compliance.UPDATE_COMPLIANCE,
      payload: { id, status: 'idle', error: null, result: null, imageId: null },
    });
    uploads.dispatch({
      type: Actions.uploads.UPDATE_UPLOAD,
      payload: { id, status: 'idle', picture: null },
    });

    // remove the picture from the sight and focus on the current sight
    sights.dispatch({ type: Actions.sights.SET_CURRENT_SIGHT, payload: { id } });
  }, [compliance, sights, uploads]);

  // reupload each picture on its own
  const handleReUpload = useCallback(async (id, picture) => {
    const current = { id, metadata: { id, label: getItemById(id, sights.state.tour).label } };

    setComplianceToCheck((prev) => prev.concat(current.metadata.id));

    await startUploadAsync(picture, current);
  }, [sights, startUploadAsync]);

  /**
   * Note(Ilyass): We removed the recursive function solution, because it takes too much time,
   * instead we re-run the compliance one more time after 1sec of getting the first response
   * */
  const verifyComplianceStatus = useCallback((pictureId, compliances, currentId) => {
    const hasTodoCompliances = Object.values(compliances).some((c) => hasTodo(c));

    if (hasTodoCompliances) {
      setTimeout(async () => {
        await checkComplianceAsync(pictureId, currentId);
      }, 500);
    }
  }, [compliance.state]);

  useEffect(() => {
    const uploadsState = uploads.state;
    const complianceState = compliance.state;
    const toCheck = Object.values(uploadsState).find((uploadedImage) => uploadedImage.status === 'fulfilled' && complianceState[uploadedImage.id].status !== 'fulfilled');

    if (!toCheck) { return; }
    if (complianceState[toCheck?.id]?.requestCount > 1) { return; }

    setComplianceToCheck((prev) => prev.concat(toCheck.id));
  }, [uploads.state, compliance.state]);

  useEffect(() => {
    const index = complianceToCheck.shift();
    const currentUploadState = uploads.state[index];
    const currentComplianceState = compliance.state[index];

    if (!index || !currentUploadState || !currentComplianceState) { return; }

    if (currentUploadState.status !== 'fulfilled') { return; }
    if (currentComplianceState.status !== 'idle') { return; }

    const pictureId = currentUploadState.pictureId;
    (async () => {
      const result = await checkComplianceAsync(pictureId, index);
      verifyComplianceStatus(pictureId, result.axiosResponse.data.compliances, index);
    })();
  }, [complianceToCheck, uploads.state, compliance.state]);

  return { handleReUpload, handleRetakeAll, handleRetake };
};

export const useMixedStates = ({ state, sights, ids }) => {
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
};

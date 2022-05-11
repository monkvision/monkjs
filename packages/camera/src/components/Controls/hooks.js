import { useCallback, useEffect, useMemo } from 'react';
import Actions from '../../actions';

const useHandlers = ({
  onStartUploadPicture, onFinishUploadPicture, checkComplianceAsync,
  enableComplianceCheck, unControlledState, stream,
}) => {
  /**
   * Note(Ilyass): We removed the recursive function solution, because it takes too much time,
   * instead we re-run the compliance one more time after 1sec of getting the first response
   * */
  const verifyComplianceStatus = (pictureId, compliances, currentId) => {
    const hasTodo = Object.values(compliances).some((c) => c.status === 'TODO' || c.is_compliant === null);

    if (hasTodo) {
      setTimeout(async () => {
        await checkComplianceAsync(pictureId, currentId);
      }, 1000);
    }
  };

  const pictureComplianceToCheck = useMemo(() => {
    const uploadsState = unControlledState.uploads.state;
    const complianceState = unControlledState.compliance.state;

    return Object.values(uploadsState).find((uploadedImage) => uploadedImage.status === 'fulfilled' && complianceState[uploadedImage.id].status !== 'fulfilled');
  }, [unControlledState.uploads, unControlledState.compliance]);

  useEffect(() => {
    if (pictureComplianceToCheck && enableComplianceCheck) {
      const index = pictureComplianceToCheck.id;
      const currentComplianceState = unControlledState.compliance.state[index];

      if (currentComplianceState.requestCount < 2) {
        const pictureId = pictureComplianceToCheck.pictureId;
        (async () => {
          const result = await checkComplianceAsync(pictureId, index);
          verifyComplianceStatus(pictureId, result.axiosResponse.data.compliances, index);
          onFinishUploadPicture();
        })();
      }
    }
  }, [pictureComplianceToCheck]);

  const capture = useCallback(async (controlledState, api, event) => {
    /** if the stream is not ready, we should not proceed to the capture callback, it will crash */
    if (!stream) { return; }

    /** `controlledState` is the state at a moment `t`, so it will be used for function that doesn't
     *  need state updates
     * `unControlledState` is the updated state, so it will be used for function that depends on
     * state updates (checkCompliance in this case that need to know when the picture is uploaded)
     */
    const state = controlledState || unControlledState;
    event.preventDefault();
    onStartUploadPicture(state, api);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
    } = api;

    const picture = await takePictureAsync();
    setPictureAsync(picture);

    const { sights } = state;
    const { current, ids } = sights.state;

    if (current.index === ids.length - 1) {
      await startUploadAsync(picture);
    } else {
      await startUploadAsync(picture);

      onFinishUploadPicture(state, api);
      goNextSight();
    }
  }, [enableComplianceCheck, onFinishUploadPicture, onStartUploadPicture, stream]);

  const retakeAll = useCallback((sightsIdsToRetake, states, setSightsIds) => {
    // adding an initialState that will hold new compliances with `requestCount = 1`
    const complianceInitialState = { id: '', status: 'idle', error: null, requestCount: 1, result: null, imageId: null };
    const complianceState = {};
    sightsIdsToRetake.forEach((id) => { complianceState[id] = { ...complianceInitialState, id }; });

    // reset uploads state with the new incoming ones
    states.uploads.dispatch({
      type: Actions.uploads.RESET_UPLOADS, ids: { sightIds: sightsIdsToRetake } });

    // update sightsIds state
    setSightsIds({ ids: sightsIdsToRetake, initialState: { compliance: complianceState } });
  }, []);
  return { capture, retakeAll };
};
export default useHandlers;

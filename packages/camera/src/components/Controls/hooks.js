import { useCallback, useEffect, useState } from 'react';
import Actions from '../../actions';

const useHandlers = ({
  onStartUploadPicture, onFinishUploadPicture, checkComplianceAsync,
  enableComplianceCheck, state,
}) => {
  const [complianceToCheck, setComplianceToCheck] = useState([]);
  /**
   * Note(Ilyass): We removed the recursive function solution, because it takes too much time,
   * instead we re-run the compliance one more time after 1sec of getting the first response
   * */
  const verifyComplianceStatus = (pictureId, compliances, currentId) => {
    const hasTodo = Object.values(compliances).some((c) => c.status === 'TODO' || c.is_compliant === null);

    if (hasTodo) {
      setTimeout(async () => {
        await checkComplianceAsync(pictureId, currentId);
      }, 500);
    }
  };

  useEffect(() => {
    const index = complianceToCheck[0];

    if (index && state.uploads.state[index].status === 'fulfilled') {
      const pictureId = state.uploads.state[index].pictureId;
      (async () => {
        if (enableComplianceCheck) {
          const result = await checkComplianceAsync(pictureId);
          verifyComplianceStatus(pictureId, result.data.compliances, index);
          setComplianceToCheck((prev) => prev.slice(1));
        }
      })();
    }
  }, [complianceToCheck, state.uploads.state]);

  const capture = useCallback(async (customState, api, event) => {
    const usedState = customState || state;
    event.preventDefault();
    onStartUploadPicture(usedState, api);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
    } = api;

    const picture = await takePictureAsync();
    setPictureAsync(picture);

    const { sights } = usedState;
    const { current, ids } = sights.state;

    setComplianceToCheck((prev) => prev.concat(current.metadata.id));

    if (current.index === ids.length - 1) {
      await startUploadAsync(picture);

      onFinishUploadPicture(usedState, api);
    } else {
      onFinishUploadPicture(usedState, api);
      goNextSight();

      await startUploadAsync(picture);
    }
  }, [enableComplianceCheck, onFinishUploadPicture, onStartUploadPicture]);

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

import { useCallback } from 'react';
// import Actions from '../../actions';

const useHandlers = () => {
  const capture = useCallback(
    ({ onStartUpload, onFinishUpload, enableComplianceCheck }) => async (state, api, event) => {
      event.preventDefault();
      onStartUpload();

      const {
        takePictureAsync,
        startUploadAsync,
        setPictureAsync,
        goNextSight,
        checkComplianceAsync,
      } = api;

      const picture = await takePictureAsync();
      setPictureAsync(picture);

      const { sights } = state;
      const { current, ids } = sights.state;

      /**
        * Note(Ilyass): We removed the recursive function solution, because it takes too much time,
        * instead we re-run the compliance one more time after 1sec of getting the first response
        * */
      const verifyComplianceStatus = (pictureId, compliances) => {
        const hasTodo = Object.values(compliances).some((c) => c.status === 'TODO' || c.is_compliant === null);

        if (hasTodo) {
          setTimeout(async () => {
            await checkComplianceAsync(pictureId, current.metadata.id);
          }, 500);
        }
      };

      if (current.index === ids.length - 1) {
        const upload = await startUploadAsync(picture);
        if (enableComplianceCheck && upload.data?.id) {
          const result = await checkComplianceAsync(upload.data.id);
          verifyComplianceStatus(upload.data.id, result.data.compliances);
        }

        onFinishUpload();
      } else {
        onFinishUpload();
        goNextSight();

        const upload = await startUploadAsync(picture);
        if (enableComplianceCheck && upload.data?.id) {
          const result = await checkComplianceAsync(upload.data.id);
          verifyComplianceStatus(upload.data.id, result.data.compliances);
        }
      }
    }, [],
  );

  // const retakeAll = useCallback((sightsIdsToRetake, states, fn) => {
  //   // adding an initialState that will hold new compliances with `requestCount = 1`
  //   const complianceInitialState = { id: '', status: 'idle', error: null, requestCount: 1, result: null, imageId: null };
  //   const complianceState = {};
  //   sightsIdsToRetake.forEach((id) => { complianceState[id] = { ...complianceInitialState, id }; });

  //   // reset uploads state with the new incoming ones
  //   states.uploads.dispatch({
  //     type: Actions.uploads.RESET_UPLOADS, ids: { sightIds: sightsIdsToRetake } });

  //   // making it smooth with a 500ms loading and toggle off the camera loading
  //   // toggleOnLoading();
  //   // setCameraLoading(false);

  //   // update sightsIds state
  //   fn({ ids: sightsIdsToRetake, initialState: { compliance: complianceState } });
  // }, []);
  return { capture };
};
export default useHandlers;

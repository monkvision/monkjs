import { useCallback } from 'react';
import Actions from '../../actions';
import log from '../../utils/log';

const useHandlers = ({
  onStartUploadPicture,
  onFinishUploadPicture,
  enableComplianceCheck,
  useApi,
  predictions,
}) => {
  const capture = useCallback(async (state, api, event) => {
    event.preventDefault();
    onStartUploadPicture(state, api);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
      checkComplianceAsync,
      startComplianceAsync,
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

    // TODO: Add sightId args
    const formatResult = (result) => ({
      compliances: {
        image_quality_assessment: {
          parameters: {},
          is_compliant: Object.values(result).reduce((prev, curr) => (prev && curr), true),
          reasons: Object.keys(result).filter((v) => !result[v]),
          status: 'DONE',
        },
        // coverage_360: {
        //   parameters: {
        //     sight_id: sightId,
        //   },
        //   is_compliant: Boolean(Math.round((Math.random() * 100) % 3)),
        //   reasons: [],
        //   status: 'DONE',
        // },
      },
    });

    if (current.index === ids.length - 1) {
      const upload = await startUploadAsync(picture);
      if (enableComplianceCheck && upload?.data?.id) {
        log([predictions]);
        log([useApi]);
        if (!useApi) {
          log(['Begin predictions']);
          const predictionsResult = await predictions.imageQualityCheck(picture);
          log([predictionsResult]);
          const result = formatResult(predictionsResult, current.metadata.id);
          await startComplianceAsync(upload.data.id, current.metadata.id, result);
        } else {
          const result = await checkComplianceAsync(upload.data.id);
          verifyComplianceStatus(upload.data.id, result.data.compliances);
        }
      }

      onFinishUploadPicture(state, api);
    } else {
      onFinishUploadPicture(state, api);
      goNextSight();

      const upload = await startUploadAsync(picture);
      if (enableComplianceCheck && upload?.data?.id) {
        log([predictions]);
        if (!useApi) {
          log(['Begin predictions']);
          const predictionsResult = await predictions.imageQualityCheck(picture);
          log([predictionsResult]);
          const result = formatResult(predictionsResult, current.metadata.id);
          await startComplianceAsync(upload.data.id, current.metadata.id, result);
        } else {
          const result = await checkComplianceAsync(upload.data.id);
          verifyComplianceStatus(upload.data.id, result.data.compliances);
        }
      }
    }
  }, [enableComplianceCheck, onFinishUploadPicture, onStartUploadPicture, predictions, useApi]);

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

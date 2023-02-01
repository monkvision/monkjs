import { useCallback } from 'react';
import { Platform } from 'react-native';
import Actions from '../../actions';
import log from '../../utils/log';

const useHandlers = ({
  onStartUploadPicture,
  onFinishUploadPicture,
  enableComplianceCheck,
  unControlledState,
  stream,
  onResetAddDamageStatus,
}) => {
  const capture = useCallback(async (controlledState, api, event, addDamageParts) => {
    /** if the stream is not ready, we should not proceed to the capture callback, it will crash */
    if (!stream && Platform.OS === 'web') { return; }

    /** `controlledState` is the state at a moment `t`, so it will be used for function that doesn't
     *  need state updates
     * `unControlledState` is the updated state, so it will be used for function that depends on
     * state updates (checkCompliance in this case that need to know when the picture is uploaded)
     */
    let captureButtonTracing;
    const state = controlledState || unControlledState;
    event.preventDefault();

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      uploadAdditionalDamage,
    } = api;

    const { sights } = state;
    const { current } = sights.state;

    onStartUploadPicture(state, api);

    if (addDamageParts && addDamageParts.length > 0) {
      log([`[Click] Taking a photo`]);
      const picture = await takePictureAsync();

      if (!picture) { return; }
      // The picture taken is an additional picture.
      await uploadAdditionalDamage({ picture, parts: addDamageParts });
      onFinishUploadPicture(state, api);
      onResetAddDamageStatus();
    } else {
      // add a process to queue
      sights.dispatch({
        type: Actions.sights.ADD_PROCESS_TO_QUEUE,
        payload: { id: current.id },
      });

      log([`[Click] Taking a photo`]);
      const picture = await takePictureAsync();

      if (!picture) { return; }

      try {
        await setPictureAsync(picture);
        await startUploadAsync(picture);
      } catch (err) {
        log([`Error in \`<Capture />\` \`set an upload PictureAsync()\`: ${err}`], 'error');
      } finally {
        // remove a process from queue
        sights.dispatch({
          type: Actions.sights.REMOVE_PROCESS_FROM_QUEUE,
          payload: { id: current.id },
        });
      }
    }

    captureButtonTracing?.finish();
  }, [
    enableComplianceCheck,
    onFinishUploadPicture,
    onStartUploadPicture,
    stream,
    onResetAddDamageStatus,
  ]);

  const customCapture = useCallback(async (api, event) => {
    if (!stream && Platform.OS === 'web') { return null; }

    event.preventDefault();

    log(['[Click] Taking a custom photo']);
    const picture = await api.takePictureAsync();

    return picture ?? null;
  }, [stream]);

  const retakeAll = useCallback((sightsIdsToRetake, states, setSightsIds) => {
    log(['[Click] Retake all photos']);
    // adding an initialState that will hold new compliance with `requestCount = 1`
    const complianceInitialState = {
      id: '',
      status: 'idle',
      error: null,
      requestCount: 1,
      result: null,
      imageId: null };
    const complianceState = {};
    sightsIdsToRetake.forEach((id) => { complianceState[id] = { ...complianceInitialState, id }; });

    // reset uploads state with the new incoming ones
    states.uploads.dispatch({
      type: Actions.uploads.RESET_UPLOADS, ids: { sightIds: sightsIdsToRetake } });

    // update sightsIds state
    setSightsIds({ ids: sightsIdsToRetake, initialState: { compliance: complianceState } });
  }, []);
  return { customCapture, capture, retakeAll };
};
export default useHandlers;

import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useError } from '@monkvision/toolkit';
import { SpanConstants } from '@monkvision/toolkit/src/hooks/useError';
import Actions from '../../actions';
import log from '../../utils/log';

const useHandlers = ({
  onStartUploadPicture,
  onFinishUploadPicture,
  enableComplianceCheck,
  unControlledState,
  stream,
  Sentry,
}) => {
  const { Span } = useError(Sentry);

  const capture = useCallback(async (controlledState, api, event) => {
    /** if the stream is not ready, we should not proceed to the capture callback, it will crash */
    if (!stream && Platform.OS === 'web') { return; }

    /** `controlledState` is the state at a moment `t`, so it will be used for function that doesn't
     *  need state updates
     * `unControlledState` is the updated state, so it will be used for function that depends on
     * state updates (checkCompliance in this case that need to know when the picture is uploaded)
     */
    let captureButtonTracing;
    if (Sentry) {
      captureButtonTracing = new Span('image-capture-button', SpanConstants.operation.USER_TIME);
    }
    const state = controlledState || unControlledState;
    event.preventDefault();

    onStartUploadPicture(state, api);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
    } = api;

    log(['[Click] Taking a photo']);
    const picture = await takePictureAsync();

    if (!picture) { return; }

    setPictureAsync(picture);

    const { sights } = state;
    const { current, ids } = sights.state;

    if (current.index === ids.length - 1) {
      await startUploadAsync(picture);
    } else {
      await startUploadAsync(picture);

      setTimeout(() => {
        onFinishUploadPicture(state, api);
        goNextSight();
      }, 500);
    }
    captureButtonTracing?.finish();
  }, [enableComplianceCheck, onFinishUploadPicture, onStartUploadPicture, stream]);

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
  return { capture, retakeAll };
};
export default useHandlers;

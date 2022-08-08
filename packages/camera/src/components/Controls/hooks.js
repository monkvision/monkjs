import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useSentry } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';
import Actions from '../../actions';
import log from '../../utils/log';
import Models from '../../hooks/useEmbeddedModel/const';

const useHandlers = ({
  onStartUploadPicture,
  onFinishUploadPicture,
  enableComplianceCheck,
  unControlledState,
  stream,
  connectionMode,
  Sentry,
}) => {
  const { Span, errorHandler } = useSentry(Sentry);

  const capture = useCallback(async (controlledState, api, event) => {
    /** if the stream is not ready, we should not proceed to the capture callback, it will crash */
    if (!stream && Platform.OS === 'web') { return null; }

    /** `controlledState` is the state at a moment `t`, so it will be used for function that doesn't
     *  need state updates
     * `unControlledState` is the updated state, so it will be used for function that depends on
     * state updates (checkCompliance in this case that need to know when the picture is uploaded)
     */
    let captureButtonTracing;
    if (Sentry) {
      captureButtonTracing = new Span('image-capture-button', SentryConstants.operation.USER_TIME);
    }
    const state = controlledState || unControlledState;
    event.preventDefault();

    onStartUploadPicture(state, api);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      predictions,
      goNextSight,
    } = api;

    log(['[Click] Taking a photo']);
    const picture = await takePictureAsync();

    if (!picture) { return null; }

    const { sights } = state;
    const { current, ids } = sights.state;
    const isFirstCaptureAtSight = state.lastTakenPicture.state.sightId !== current.id;

    state.lastTakenPicture.dispatch({
      type: Actions.lastTakenPicture.SET_PICTURE,
      payload: { picture, sightId: current.id },
    });

    const compliance = {
      blurriness: false,
      overexposure: false,
      underexposure: false,
    };
    let isComplianceInError = false;

    if (isFirstCaptureAtSight && ['semi-offline', 'offline'].includes(connectionMode)) {
      try {
        let complianceSpan;
        if (Sentry) {
          complianceSpan = new Span('embedded-compliance-time', SentryConstants.operation.FUNC);
        }
        const details = await predictions[Models.imageQualityCheck.name](picture);
        const result = {
          details,
          is_compliant:
            details.blurriness_score[0] < Models.imageQualityCheck.minConfidence.blurriness
            && details.overexposure_score[0] < Models.imageQualityCheck.minConfidence.overexposure
            && details.underexposure_score[0] < Models
              .imageQualityCheck.minConfidence.underexposure,
          parameters: {},
          reasons: [],
          status: 'DONE',
        };
        complianceSpan?.addDataToSpan(result);
        state.embeddedCompliance.dispatch({
          type: Actions.embeddedCompliance.UPDATE_EMBEDDED_COMPLIANCE,
          payload: { id: current.id, result },
        });
        compliance.blurriness = details.blurriness_score < Models
          .imageQualityCheck.minConfidence.blurriness;
        compliance.overexposure = details.overexposure_score < Models
          .imageQualityCheck.minConfidence.overexposure;
        compliance.underexposure = details.underexposure_score < Models
          .imageQualityCheck.minConfidence.underexposure;

        complianceSpan?.finish();
      } catch (err) {
        const additionalTags = { sightId: current.id };
        errorHandler(err, SentryConstants.type.COMPLIANCE, null, additionalTags);
        isComplianceInError = true;
      }
    }

    setPictureAsync(picture);

    const isCompliant = compliance.blurriness
      && compliance.overexposure
      && compliance.underexposure;

    if (!isCompliant
      && !isComplianceInError
      && isFirstCaptureAtSight
      && ['semi-offline', 'offline'].includes(connectionMode)
    ) {
      onFinishUploadPicture(state, api);
    } else if (current.index === ids.length - 1) {
      await startUploadAsync(picture);
    } else {
      await startUploadAsync(picture);

      setTimeout(() => {
        onFinishUploadPicture(state, api);
        goNextSight();
      }, 500);
    }
    captureButtonTracing?.finish();
    return compliance;
  }, [
    enableComplianceCheck,
    onFinishUploadPicture,
    onStartUploadPicture,
    stream,
    connectionMode,
  ]);

  const retakeAll = useCallback((sightsIdsToRetake, states, setSightsIds) => {
    log(['[Click] Retake all photos']);
    // adding an initialState that will hold new compliance with `requestCount = 1`
    const complianceInitialState = {
      id: '',
      status: 'idle',
      error: null,
      requestCount: 1,
      result: null,
      imageId: null,
    };
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

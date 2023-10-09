import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useMonitoring, SentryImageTypes, SentryTransaction, SentryOperation, SentrySpan, SentryTag } from '@monkvision/corejs';
import Actions from '../../actions';
import log from '../../utils/log';

const useHandlers = ({
  onStartUploadPicture,
  onFinishUploadPicture,
  enableComplianceCheck,
  unControlledState,
  stream,
  onResetAddDamageStatus,
  onPictureTaken,
  isRetake,
}) => {
  const { measurePerformance } = useMonitoring();
  const capture = useCallback(async (controlledState, api, event, addDamageParts) => {
    /** if the stream is not ready, we should not proceed to the capture callback, it will crash */
    if (!stream && Platform.OS === 'web') { return; }

    /** `controlledState` is the state at a moment `t`, so it will be used for function that doesn't
     *  need state updates
     * `unControlledState` is the updated state, so it will be used for function that depends on
     * state updates (checkCompliance in this case that need to know when the picture is uploaded)
     */
    const state = controlledState || unControlledState;
    event.preventDefault();

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      uploadAdditionalDamage,
    } = api;

    const { inspectionId, sights, task } = state;
    const { current } = sights.state;

    onStartUploadPicture(state, api);

    if (addDamageParts && addDamageParts.length > 0) {
      log([`[Click] Taking a photo`]);
      const picture = await takePictureAsync();

      if (!picture) { return; }
      // The picture taken is an additional picture.
      await uploadAdditionalDamage({ picture, parts: addDamageParts });
      onFinishUploadPicture(state, api);
      onPictureTaken({ picture, isZoomedPicture: true, sight: null });
      onResetAddDamageStatus();
    } else {
      /**
       * create a new transaction names 'Capture Sight' to measure the performance
       */
      const transaction = measurePerformance(
        SentryTransaction.PICTURE_PROCESSING,
        SentryOperation.CAPTURE_SIGHT,
      );

      /**
       * set tags to relate multiple transactions with a single inspection
       */
      transaction.setTag(SentryTag.TASK, task);
      transaction.setTag(SentryTag.SIGHT_ID, current.id);
      transaction.setTag(
        SentryTag.IMAGE_TYPE,
        isRetake ? SentryImageTypes.RETAKE : SentryImageTypes.CAPTURE,
      );
      transaction.setTag(SentryTag.INSPECTION_ID, inspectionId);

      // add a process to queue
      sights.dispatch({
        type: Actions.sights.ADD_PROCESS_TO_QUEUE,
        payload: { id: current.id },
      });

      /**
       * Take a pic from canvas and measure it's performance
       */
      transaction.startSpan(SentrySpan.TAKE_PIC);
      log([`[Click] Taking a pic has started`]);
      const picture = await takePictureAsync();
      transaction.finishSpan(SentrySpan.TAKE_PIC);

      if (!picture) { return; }

      try {
        /**
         * Create a thumbnail and measure it's performance
         */
        transaction.startSpan(SentrySpan.CREATE_THUMBNAIL);
        await setPictureAsync(picture);
        transaction.finishSpan(SentrySpan.CREATE_THUMBNAIL);

        /**
         * Upload a pic and measure it's performance
         */
        transaction.startSpan(SentrySpan.UPLOAD_PIC);
        await startUploadAsync(picture);
        transaction.finishSpan(SentrySpan.UPLOAD_PIC);
        onPictureTaken({ picture, isZoomedPicture: false, sight: current.id });
      } catch (err) {
        transaction.finishSpan(SentrySpan.CREATE_THUMBNAIL);
        transaction.finishSpan(SentrySpan.UPLOAD_PIC);
        log([`Error in \`<Capture />\` \`set an upload PictureAsync()\`: ${err}`], 'error');
      } finally {
        // remove a process from queue
        sights.dispatch({
          type: Actions.sights.REMOVE_PROCESS_FROM_QUEUE,
          payload: { id: current.id },
        });
        // finish a running transaction
        transaction.finish();
        log([`[Click] Taking a pic has completed`]);
      }
    }
  }, [
    enableComplianceCheck,
    onFinishUploadPicture,
    onStartUploadPicture,
    stream,
    onResetAddDamageStatus,
    onPictureTaken,
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

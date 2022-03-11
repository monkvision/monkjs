import { useCallback } from 'react';

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

      if (current.index === ids.length - 1) {
        const upload = await startUploadAsync(picture);
        if (enableComplianceCheck && upload.data?.id) {
          await checkComplianceAsync(upload.data.id);
        }

        onFinishUpload();
      } else {
        onFinishUpload();
        goNextSight();

        const upload = await startUploadAsync(picture);
        if (enableComplianceCheck && upload.data?.id) {
          await checkComplianceAsync(upload.data.id);
        }
      }
    }, [],
  );

  return { capture };
};
export default useHandlers;

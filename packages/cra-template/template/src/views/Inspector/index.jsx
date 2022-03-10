import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// we can import UploadCenter from `@monkvision/camera`
import { Capture, Controls } from '@monkvision/camera';
import CssBaseline from '@mui/material/CssBaseline';
import View from 'components/View';

export default function Inspector({ inspectionId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState();

  const id = location.state?.inspectionId || inspectionId;

  const handleGoToInspectionPage = useCallback(() => navigate('/'), [navigate]);

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setLoading(true);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
      /** --- With upload center ---
        checkComplianceAsync,
       */
    } = api;

    const picture = await takePictureAsync();
    setPictureAsync(picture);

    const { sights } = state;
    const { current, ids } = sights.state;

    if (current.index === ids.length - 1) {
      /** --- With upload center ---
      const upload = await startUploadAsync(picture);
      if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }

      --- Without upload center ---
      await startUploadAsync(picture);
       */
      await startUploadAsync(picture);

      setLoading(false);
    } else {
      setLoading(false);
      goNextSight();

      /** --- With upload center ---
      const upload = await startUploadAsync(picture);
      if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }

      --- Without upload center ---
      await startUploadAsync(picture);
       */

      await startUploadAsync(picture);
    }
  }, []);

  const controls = [{
    disabled: loading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  return (
    <View viewName="home" title="Home">
      <CssBaseline />
      <Capture
        inspectionId={id}
        controls={controls}
        loading={loading}
        onFinish={handleGoToInspectionPage}
        primaryColor={process.env.REACT_APP_PRIMARY_COLOR_DARK}

        /** --- With UploadCenter ---
         * renderOnFinish={UploadCenter}
         * submitButtonProps={{ title: "Skip Retaking", onPress: handleGoToInspectionPage }}
         *
         * --- Without UploadCenter ---
         * onFinish={handleGoToInspectionPage}
         */
      />
    </View>
  );
}

Inspector.propTypes = {
  inspectionId: PropTypes.string,
};

Inspector.defaultProps = {
  inspectionId: '',
};

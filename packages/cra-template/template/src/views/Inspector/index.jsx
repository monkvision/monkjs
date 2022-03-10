import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
      checkComplianceAsync,
    } = api;

    const picture = await takePictureAsync();
    setPictureAsync(picture);

    const { sights } = state;
    const { current, ids } = sights.state;

    if (current.index === ids.length - 1) {
      const upload = await startUploadAsync(picture);
      if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }

      setLoading(false);
    } else {
      setLoading(false);
      goNextSight();

      const upload = await startUploadAsync(picture);
      if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }
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

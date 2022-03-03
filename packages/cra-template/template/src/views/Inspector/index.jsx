import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Capture, Controls } from '@monkvision/camera';
import CssBaseline from '@mui/material/CssBaseline';
import View from 'components/View';

export default function Inspector({ inspectionId }) {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState();

  const id = location.state?.inspectionId || inspectionId;

  const handleGoToInspectionPage = useCallback(() => history.push('/'), [history]);

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();

    const { takePictureAsync, startUploadAsync, goNextSight } = api;

    setLoading(true);
    const picture = await takePictureAsync();
    if (picture) {
      setLoading(false);
      goNextSight();
      startUploadAsync(picture);
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

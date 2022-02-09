import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Capture, Controls } from '@monkvision/camera';
import CssBaseline from '@mui/material/CssBaseline';
import View from 'components/View';

export default function Inspector({ inspectionId }) {
  const location = useLocation();
  const [loading, setLoading] = useState();

  const id = location.state?.inspectionId || inspectionId;

  const handleCapture = useCallback(async (monk) => {
    const { takePictureAsync, startUploadAsync, goNextSight } = monk;

    setLoading(true);
    const { picture } = await takePictureAsync();

    setTimeout(() => {
      setLoading(false);
      goNextSight();
      startUploadAsync(picture);
    }, 200);
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

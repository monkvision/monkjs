import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Capture, Controls, Constants, useUploads } from '@monkvision/camera';
import CssBaseline from '@mui/material/CssBaseline';
import View from 'components/View';

export default function Inspector({ inspectionId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState();

  const id = location.state?.inspectionId || inspectionId;

  const handleGoToInspectionPage = useCallback(() => navigate('/'), [navigate]);

  const uploads = useUploads({ sightIds: Constants.defaultSightIds });

  const controls = [{
    disabled: loading,
    ...Controls.CaptureButtonProps,
  }];

  return (
    <View viewName="home" title="Home">
      <CssBaseline />
      <Capture
        sightIds={Constants.defaultSightIds}
        inspectionId={id}
        controls={controls}
        uploads={uploads}
        loading={loading}
        primaryColor={process.env.REACT_APP_PRIMARY_COLOR_DARK}
        onReady={() => setLoading(false)}
        onStartUploadPicture={() => setLoading(true)}
        onFinishUploadPicture={() => setLoading(false)}
        onCaptureTourFinish={handleGoToInspectionPage}

        /** --- With picture quality check
         * enableComplianceCheck={true}
         * onComplianceCheckFinish={handleGoToInspectionPage}
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

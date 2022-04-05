import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ScreenView } from '@monkvision/ui';
import { useRoute } from '@react-navigation/native';
import { Capture, Controls, Constants, useUploads } from '@monkvision/camera';

import styles from './styles';

export default function InspectionCapture({ onSuccess }) {
  const route = useRoute();
  const { inspectionId } = route.params;

  const [cameraLoading, setCameraLoading] = useState(false);
  const uploads = useUploads({ sightIds: Constants.defaultSightIds });

  const controls = [{
    disabled: cameraLoading,
    ...Controls.CaptureButtonProps,
  }];

  return (
    <ScreenView style={styles.safeArea}>
      <Capture
        sightIds={Constants.defaultSightIds}
        inspectionId={inspectionId}
        controls={controls}
        loading={cameraLoading}
        uploads={uploads}
        enableComplianceCheck
        onComplianceCheckFinish={onSuccess}
        onReady={() => setCameraLoading(false)}
        onStartUploadPicture={() => setCameraLoading(true)}
        onFinishUploadPicture={() => setCameraLoading(false)}

        /** --- With upload center
         * enableComplianceCheck={true}
         * onComplianceCheckStart={() => {...}}
         * onComplianceCheckFinish={() => {...}}
         * onRetakeAll={() => {...}}
         *
         * --- Without upload center
         * onCaptureTourStart={() => {...}}
         * onCaptureTourFinish={() => {...}}
         */
      />
    </ScreenView>
  );
}

InspectionCapture.propTypes = {
  onSuccess: PropTypes.func,
};

InspectionCapture.defaultProps = {
  onSuccess: () => {},
};

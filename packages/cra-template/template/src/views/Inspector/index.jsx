import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import monk from '@monkvision/corejs';

import { useLocation, useNavigate } from 'react-router-dom';

import { Capture, Controls, Constants } from '@monkvision/camera';
import { utils } from '@monkvision/toolkit';
import CssBaseline from '@mui/material/CssBaseline';

import View from 'components/View';

const mapTasksToSights = [{
  id: 'sLu0CfOt',
  task: {
    name: monk.types.TaskName.IMAGES_OCR,
    image_details: {
      image_type: monk.types.ImageOcrType.VIN,
    },
  },
}, {
  id: 'xQKQ0bXS',
  tasks: [monk.types.TaskName.WHEEL_ANALYSIS],
  payload: {},
}, {
  id: '8_W2PO8L',
  tasks: [monk.types.TaskName.WHEEL_ANALYSIS],
  payload: {},
}, {
  id: 'rN39Y3HR',
  tasks: [monk.types.TaskName.WHEEL_ANALYSIS],
  payload: {},
}, {
  id: 'PuIw17h0',
  tasks: [monk.types.TaskName.WHEEL_ANALYSIS],
  payload: {},
}];

export default function Inspector({ inspectionId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState(false);

  const id = location.state?.inspectionId || inspectionId;

  const handleGoToInspectionPage = useCallback(() => navigate('/'), [navigate]);

  const handleSuccess = useCallback(async () => {
    if (success) {
      setLoading(true);

      try {
        // const params = { inspectionId, name: 'taskName', data: { status: 'TODO' } };
        // const payload = await monk.entity.task.updateOne(params);
        // const { entities, result } = payload;
        // dispatch(monk.actions.gotOneTask({ entities, result, inspectionId }));

        setLoading(false);

        handleGoToInspectionPage();
      } catch (err) {
        utils.log([`Error after taking picture: ${err}`], 'error');
        setLoading(false);
      }
    }
  }, [handleGoToInspectionPage, success]);

  const handleChange = useCallback((state) => {
    if (!success) {
      try {
        const { takenPictures, tour } = state.sights.state;
        const totalPictures = Object.keys(tour).length;
        const uploadState = Object.values(state.uploads.state);

        const fulfilledUploads = uploadState.filter(({ status }) => status === 'fulfilled').length;
        const retriedUploads = uploadState.filter(({ requestCount }) => requestCount > 1).length;

        const hasPictures = Object.keys(takenPictures).length === totalPictures;
        const hasBeenUploaded = (
          fulfilledUploads === totalPictures
          || retriedUploads >= totalPictures - fulfilledUploads
        );

        if (hasPictures && hasBeenUploaded) {
          setSuccess(true);
        }
      } catch (err) {
        utils.log([`Error handling Capture state change: ${err}`], 'error');
        throw err;
      }
    }
  }, [success]);

  useEffect(() => { handleSuccess(); }, [handleSuccess, success]);

  const controls = [{
    disabled: loading,
    ...Controls.CaptureButtonProps,
  }];

  return (
    <View viewName="home" title="Home">
      <CssBaseline />
      <Capture
        mapTasksToSights={mapTasksToSights}
        inspectionId={id}
        controls={controls}
        loading={loading}
        onReady={() => setLoading(false)}
        onStartUploadPicture={() => setLoading(true)}
        onFinishUploadPicture={() => setLoading(false)}
        onChange={handleChange}
        sightIds={Constants.defaultSightIds}
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

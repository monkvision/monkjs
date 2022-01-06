import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

import ImageViewer from '../../ImageViewer';
import CameraSimpleView from '../../CaptureTour/CameraSimpleView';

import { damagePicturesPropType } from '../proptypes';

const styles = StyleSheet.create({
  cameraLayout: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    position: 'relative' },
});

export default function CameraSimpleViewModal({
  theme, setDamagePictures, closeCameraView, openPreviewDialog, damagePictures, ...rest
}) {
  return (
    <>
      <Portal>
        <View style={styles.cameraLayout}>
          <CameraSimpleView
            isLoading={false}
            onTakePicture={(picture) => setDamagePictures(
              (prev) => (prev?.length ? [...prev, picture] : [picture]),
            )}
            onCloseCamera={closeCameraView}
            theme={theme}
            initialPicturesState={damagePictures}
          />
        </View>
      </Portal>
      <ImageViewer {...rest} />
    </>
  );
}
CameraSimpleViewModal.propTypes = {
  closeCameraView: PropTypes.func.isRequired,
  damagePictures: damagePicturesPropType.isRequired,
  openPreviewDialog: PropTypes.func.isRequired,
  setDamagePictures: PropTypes.func.isRequired,
};

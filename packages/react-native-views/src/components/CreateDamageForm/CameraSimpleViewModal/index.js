import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Portal, Modal } from 'react-native-paper';

import ImageViewer from '../../ImageViewer';
import CameraSimpleView from '../../CaptureTour/CameraSimpleView';

import DamagePicturesCameraPreview from '../DamagePicturesCameraPreview';
import { damagePicturesPropType } from '../proptypes';

export default function CameraSimpleViewModal({
  theme, setDamagePictures, closeCameraView, openPreviewDialog, damagePictures, ...rest
}) {
  return (
    <>
      <Portal>
        <Modal visible>
          <View style={{ backgroundColor: '#FFF', width: '100%', height: '100%', position: 'relative' }}>
            <CameraSimpleView
              isLoading={false}
              onTakePicture={(picture) => setDamagePictures(
                (prev) => (prev?.length ? [...prev, picture] : [picture]),
              )}
              onCloseCamera={closeCameraView}
              theme={theme}
              initialPicturesState={damagePictures}
              renderOverlay={() => (
                <DamagePicturesCameraPreview
                  onPress={openPreviewDialog}
                  damagePictures={damagePictures}
                />
              )}
            />
          </View>
        </Modal>
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

import React from 'react';
import { CameraView } from '@monkvision/react-native-views';

export default () => {
  // eslint-disable-next-line no-console
  const handleSuccess = (payload) => console.log(payload);

  return <CameraView onSuccess={handleSuccess} />;
};

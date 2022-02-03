// import React, { useCallback, useState } from 'react';
// import { Capture, Controls } from '@monkvision/camera';
// import { SafeAreaView, StatusBar } from 'react-native';
//
// export default function Test() {
//   const [loading, setLoading] = useState();
//
//   const handleCapture = useCallback(async (api) => {
//     const { takePictureAsync, startUploadAsync, goNextSight } = api;
//
//     setLoading(true);
//     const { picture } = await takePictureAsync();
//
//     setTimeout(() => {
//       setLoading(false);
//       goNextSight();
//       startUploadAsync(picture);
//     }, 200);
//   }, []);
//
//   const controls = [{
//     disabled: loading,
//     onPress: handleCapture,
//     ...Controls.CaptureButtonProps,
//   }];
//
//   return (
//     <SafeAreaView>
//       <StatusBar hidden />
//       <Capture
//         inspectionId="b5f85f7d-6722-8690-b592-fd02600496f2"
//         controls={controls}
//         loading={loading}
//       />
//     </SafeAreaView>
//   );
// }

import React from 'react';
import { SafeAreaView } from 'react-native';

export default function Test() {
  return (
    <SafeAreaView />
  );
}

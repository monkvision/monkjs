// import React, { useCallback, useState } from 'react';
// import { Capture, Controls } from '@monkvision/camera';
// import { SafeAreaView, StatusBar } from 'react-native';
//
// export default function Test() {
//   const [loading, setLoading] = useState();
//
//   const handleCapture = useCallback(async (state, api, event) => {
//     event.preventDefault();
//     setLoading(true);
//
//     const { takePictureAsync, startUploadAsync, goNextSight } = api;
//
//     setTimeout(async () => {
//       const picture = await takePictureAsync();
//       setLoading(false);
//
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
//         inspectionId="9d3cca7a-cfd0-8323-9d56-6805c8f693be"
//         controls={controls}
//         loading={loading}
//         sightIds={['0U14gFyk', '1-gwCM0m', '2RFF3Uf8', '2wVqenwP']}
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

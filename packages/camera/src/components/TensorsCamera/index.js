import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as MediaLibrary from 'expo-media-library';

const TensorCamera = cameraWithTensors(Camera);

export default function TensorsCamera() {
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    cameraRef.current.camera.takePictureAsync().then((result) => {
      MediaLibrary.saveToLibraryAsync(result.uri);
    });
  };

  return (
    <View>
      <TensorCamera
        ref={cameraRef}
        style={{
          width: 600,
          height: 600,
        }}
        autorender
        type={Camera.Constants.Type.back}
      />
      <View style={{ marginTop: 50 }}>
        <Button onPress={() => takePicture()} title="Take Picture" />
      </View>
    </View>
  );
}

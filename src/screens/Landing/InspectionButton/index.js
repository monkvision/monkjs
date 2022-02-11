import React, { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

import { INSPECTION_VIN, INSPECTION_IMPORT } from 'screens/names';

const styles = StyleSheet.create({
  inspectionButton: {
    position: Platform.select({
      native: 'absolute',
      default: 'fixed',
    }),
    flexDirection: 'row',
    bottom: 8,
    right: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: 8,
    marginLeft: 8,
  },
  importButton: {
    backgroundColor: '#333',
  },
});

export default function InspectionButton() {
  const navigation = useNavigation();

  const handleTakePictures = useCallback(
    () => navigation.navigate(INSPECTION_VIN),
    [navigation],
  );

  const handleImportPictures = useCallback(
    () => navigation.navigate(INSPECTION_IMPORT),
    [navigation],
  );

  return (
    <View style={styles.inspectionButton}>
      <Button
        icon="camera-image"
        mode="contained"
        onPress={handleImportPictures}
        style={[styles.button, styles.importButton]}
      >
        Import
      </Button>
      <Button
        icon="camera"
        mode="contained"
        onPress={handleTakePictures}
        style={styles.button}
      >
        Take pictures
      </Button>
    </View>
  );
}

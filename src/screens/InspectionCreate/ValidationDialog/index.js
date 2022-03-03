/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, useTheme } from 'react-native-paper';
import Drawing from 'components/Drawing';

import { INSPECTION_READ } from 'screens/names';
import styles from 'screens/InspectionCreate/styles';
import uploaded from 'screens/InspectionCreate/assets/undraw_order_confirmed_re_g0if.svg';

export default function ValidationDialog({ screen, requests, inspectionId }) {
  const theme = useTheme();
  const navigation = useNavigation();

  const {
    isVisibleDialog,
    isCompleted,
    isUploading,
  } = screen.state;

  const { savePictures, updateTask } = requests;

  const handleDismiss = useCallback(() => {
    navigation.navigate(INSPECTION_READ, { inspectionId });
  }, [inspectionId, navigation]);

  const handleSavePictures = useCallback(() => {
    savePictures.saveToDevice();
  }, [savePictures]);

  return (
    <Portal>
      <Dialog
        visible={isVisibleDialog && isCompleted && !isUploading}
        style={styles.dialog}
        onDismiss={handleDismiss}
      >
        <View style={styles.dialogDrawing}>
          <Drawing xml={uploaded} height="75" />
        </View>
        <Dialog.Title style={styles.dialogContent}>
          All images are uploaded
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogContent}>
            Do you want to save pictures in your device before seeing the inspection?
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button
            icon={savePictures.isLoading || (savePictures.isSaved ? undefined : 'download')}
            loading={savePictures.isLoading}
            disabled={savePictures.isLoading || savePictures.isSaved}
            onPress={handleSavePictures}
            mode="outlined"
            style={styles.button}
          >
            {savePictures.isSaved ? 'Photos Saved !' : 'Save in device'}
          </Button>
          <Button
            onPress={() => updateTask.request()}
            mode="contained"
            labelStyle={{ color: 'white' }}
            color={theme.colors.success}
            style={styles.button}
          >
            Start inspection
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

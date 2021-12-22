/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, useTheme } from 'react-native-paper';
import Drawing from 'components/Drawing';

import { LANDING } from 'screens/names';
import completing from 'screens/InspectionCreate/assets/undraw_order_confirmed_re_g0if.svg';
import styles from 'screens/InspectionCreate/styles';

export default function ValidationDialog({ screen, requests }) {
  const theme = useTheme();
  const navigation = useNavigation();

  const {
    isVisibleDialog,
    isCompleted,
    isUploading,
    isTaskUpdated,
    uploadHasFailed,
  } = screen.state;

  const { savePictures, updateTask } = requests;

  const handleDismiss = useCallback(() => {
    navigation.navigate(LANDING);
  }, [navigation]);

  const handleUpdateTask = useCallback(() => {
    updateTask.request();
  }, [updateTask]);

  const handleSavePictures = useCallback(() => {
    savePictures.saveToDevice();
    navigation.navigate(LANDING);
  }, [navigation, savePictures]);

  return (
    <Portal>
      <Dialog
        visible={isVisibleDialog && isCompleted && !isUploading}
        style={styles.dialog}
        onDismiss={handleDismiss}
      >
        <View style={styles.dialogDrawing}>
          <Drawing xml={completing} width="200" height="75" />
        </View>
        <Dialog.Title style={styles.dialogContent}>
          All images are uploaded
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogContent}>
            Would you like to start the analyze ?
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
            { savePictures.isSaved ? 'Photos Saved !' : 'Save in device' }
          </Button>
          {!uploadHasFailed && (isTaskUpdated ? (
            <Button
              onPress={screen.handleNext}
              mode="contained"
              labelStyle={{ color: 'white' }}
              color={theme.colors.success}
              style={styles.button}
            >
              See inspection
            </Button>
          ) : (
            <Button
              icon={updateTask.isLoading ? undefined : 'eye-circle-outline'}
              onPress={handleUpdateTask}
              loading={updateTask.isLoading}
              disabled={updateTask.isLoading}
              mode="contained"
              labelStyle={{ color: 'white' }}
              color={theme.colors.success}
              style={styles.button}
            >
              Analyze with AI
            </Button>
          ))}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

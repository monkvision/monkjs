import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useTheme, Button, TextInput, IconButton, Card } from 'react-native-paper';

import { useFakeActivity, ActivityIndicatorView, CameraView } from '@monkvision/react-native-views';
import { createOneInspection, Sight, values } from '@monkvision/corejs';

import { INSPECTION_CREATE } from 'screens/names';
import useRequest from 'hooks/useRequest/index';
import { spacing } from 'config/theme';

const styles = StyleSheet.create({
  contentLayout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 200,
  },
  picture: {
    width: '100%',
    maxWidth: 512,
    height: 60,
    borderRadius: 4,
  },
  textInput: {
    width: '100%',
    maxWidth: 512,
    marginBottom: spacing(1),
  },
  actions: {
    margin: spacing(1),
    alignItems: 'stretch',
    justifyContent: 'center',
    ...Platform.select({
      native: {
        flexDirection: 'row',
        display: 'flex',
        flexWrap: 'wrap',
      },
    }),
  },
  button: {
    marginBottom: spacing(1),
    marginHorizontal: spacing(1),
    ...Platform.select({
      web: { width: 140 },
      default: { width: '100%' },
    }),
  },
});

const uri = `https://images.unsplash.com/photo-1638644420471-6c7cad1f6d81?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=664&q=80`;
const vin = 'LG SDSA SAVCALD';

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [inspectionId, setInspectionId] = useState(false);
  const [camera, setCamera] = useState(false);
  const [picture, setVinPicture] = useState(uri);

  const payload = { data: { tasks: { damage_detection: { status: 'NOT_STARTED' } } } };
  const callbacks = { onSuccess: ({ result }) => setInspectionId(result) };

  const { isLoading } = useRequest(createOneInspection(payload), callbacks);

  const vinSight = Object.values(values.sights.abstract).map((s) => new Sight(...s)).filter((item) => item.id === 'vin');

  const handleTakePictures = useCallback(
    () => navigation.navigate(INSPECTION_CREATE, { inspectionId }),
    [inspectionId, navigation],
  );
  const handleTakeVin = useCallback(() => setCamera(true), []);

  const [fakeActivity] = useFakeActivity(isLoading);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Inspection VIN',
      });
    }
  }, [navigation]);

  if (fakeActivity) { return <ActivityIndicatorView />; }
  if (camera) {
    return (
      <CameraView
        sights={vinSight}
        isLoading={fakeActivity}
        onTakePicture={(pic) => {
          setVinPicture(pic);
        }}
        onCloseCamera={() => {
          setCamera(false);
        }}
        onSuccess={() => {
          setCamera(false);
        }}
        theme={theme}
      />
    );
  }
  return (
    <SafeAreaView>
      <Card>
        <Card.Title title="Set your vin" right={() => <Button icon="book">Where to find?</Button>} />
        <Card.Content style={styles.contentLayout}>
          <TextInput
            style={styles.textInput}
            placeholder="Vin"
            value={vin}
            mode="outlined"
            label="Vin"
            right={<IconButton icon="edit" />}
          />
          {uri ? <Image source={{ uri: picture }} style={styles.picture} />
            : <IconButton icon="camera" onPress={handleTakeVin} />}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button onPress={handleTakePictures} style={styles.button} mode="contained" color={theme.colors.primary}>
            Validate vin
          </Button>
          <Button onPress={handleTakePictures} style={styles.button}>Skip</Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
};

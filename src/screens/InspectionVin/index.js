import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, SafeAreaView, Platform, Text } from 'react-native';
import { useTheme, Button, TextInput, IconButton, Card } from 'react-native-paper';

import { useFakeActivity, ActivityIndicatorView, CameraView, useToggle } from '@monkvision/react-native-views';
import { createOneInspection, Sight, values } from '@monkvision/corejs';

import { INSPECTION_CREATE } from 'screens/names';
import useRequest from 'hooks/useRequest/index';
import { spacing } from 'config/theme';
import useUpload from 'hooks/useUpload/index';
import VinGuide from './VinGuide/index';

const styles = StyleSheet.create({

  picture: {
    width: '100%',
    maxWidth: 512,
    height: 60,
    borderRadius: 4,
    marginTop: spacing(2),
    alignSelf: 'center',
  },
  textInput: {
    width: '100%',
    maxWidth: 512,
    alignSelf: 'center',
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
  captureVinButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignSelf: 'center',
  },
  orText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: spacing(2),
  },
  text: {
    marginBottom: spacing(2),
  },
});

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [validating, setValidating] = useState(false);
  const [inspectionId, setInspectionId] = useState(false);
  const [camera, setCamera] = useState(false);
  const [vinPicture, setVinPicture] = useState();

  // to be filled with vin from ML
  const [vin] = useState('1 G1 YZ23J 9P5 803427');
  const [guideIsOpen, handleOpenGuide, handleCloseGuide] = useToggle();

  const payload = { data: { tasks: { damage_detection: { status: 'NOT_STARTED' } } } };
  const callbacks = { onSuccess: ({ result }) => setInspectionId(result) };

  const { isLoading } = useRequest(createOneInspection(payload), callbacks);

  const vinSight = Object.values(values.sights.abstract).map((s) => new Sight(...s)).filter((item) => item.id === 'vin');

  const handleTakePictures = useCallback(
    () => navigation.navigate(INSPECTION_CREATE, { inspectionId }),
    [inspectionId, navigation],
  );
  const handleOpenVinCameraOrRetake = useCallback(() => {
    if (vinPicture) { setVinPicture(null); }

    navigation?.setOptions({ headerShown: false });
    setCamera(true);
  }, [navigation, vinPicture]);

  const handleCloseVinCamera = useCallback(() => {
    navigation?.setOptions({ headerShown: true });
    setCamera(false);
  }, [navigation]);

  const upload = useUpload({
    inspectionId,
    onSuccess: () => { handleTakePictures(); setValidating(false); },
    onLoading: () => setValidating(true),
    onError: () => setValidating(false),
  });

  const handleValidateVin = useCallback(() => {
    upload(Platform.OS === 'web' ? vinPicture.source.base64 : vinPicture.source.uri, vinSight[0].id);
  }, [upload, vinSight, vinPicture?.source]);

  const [fakeActivity] = useFakeActivity(isLoading);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Inspection VIN',
      });
    }
  }, [navigation]);

  if (fakeActivity) { return <ActivityIndicatorView light />; }

  if (camera) {
    return (
      <CameraView
        sights={vinSight}
        isLoading={fakeActivity}
        onTakePicture={(pic) => setVinPicture(pic)}
        onSuccess={handleCloseVinCamera}
        theme={theme}
      />
    );
  }

  return (
    <SafeAreaView>
      <VinGuide isOpen={guideIsOpen} handleClose={handleCloseGuide} />
      <Card>
        <Card.Title
          title="Set your vin"
          right={() => <Button onPress={handleOpenGuide} icon="book">Where to find?</Button>}
        />
        <Card.Content>
          <Text style={styles.text}>Take a clear picture of your VIN, or type it manually.</Text>
          <TextInput
            style={styles.textInput}
            placeholder="VFX XXXXX XXXXXXXX"
            value={vin}
            mode="outlined"
            label="Vin"
            right={<IconButton icon="edit" />}
          />
          {vinPicture ? <Image source={{ uri: `data:image/jpeg;base64,${vinPicture.source.base64}` }} style={styles.picture} />
            : null}

          <Text style={styles.orText}>OR</Text>
          <IconButton style={[styles.captureVinButton, { backgroundColor: theme.colors.primary }]} mode="contained" color="#FFF" icon={vinPicture ? 'reload' : 'camera'} onPress={handleOpenVinCameraOrRetake} />

        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button onPress={handleValidateVin} loading={validating} style={styles.button} mode="contained" disabled={!vinPicture || !vin || validating} labelStyle={{ color: '#FFF' }}>
            Validate vin
          </Button>
          <Button onPress={handleTakePictures} style={styles.button}>Skip</Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
};

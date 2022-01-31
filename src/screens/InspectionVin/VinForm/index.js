import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Platform, Text } from 'react-native';
import { useTheme, Button, TextInput, IconButton, Card } from 'react-native-paper';
import { useFormik } from 'formik';
import { propTypes } from '@monkvision/react-native';
import { updateOneInspectionVehicle } from '@monkvision/corejs';
import PropTypes from 'prop-types';

import { INSPECTION_CREATE } from 'screens/names';
import { spacing } from 'config/theme';
import useRequest from 'hooks/useRequest/index';

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
  wait: {
    marginBottom: spacing(2),
    color: 'gray',
  },
});

export default function VinForm({
  inspectionId,
  vin,
  handleOpenGuide,
  handleOpenCamera,
  vinPicture,
  ocrIsLoading,
  isUploading,
}) {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleTakePictures = useCallback(
    () => navigation.navigate(INSPECTION_CREATE, { inspectionId }),
    [inspectionId, navigation],
  );
  const { isLoading: isSubmittingVehicleInfo,
    request: submitVehicleInfo } = useRequest(null, {}, false);

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { vin: vin || '' },
    enableReinitialize: true,
    onSubmit: ({ vals }) => {
      submitVehicleInfo(updateOneInspectionVehicle({ inspectionId, data: { ...vals, market_value: { unit: 'EUR', value: 1 }, mileage: { value: 1, unit: 'km' } } }),
        { onSuccess: handleTakePictures });
    },
  });

  return (
    <Card>
      <Card.Title
        title="Set your vin"
        right={() => <Button onPress={handleOpenGuide} icon="book">Where to find?</Button>}
      />
      <Card.Content>
        <Text style={styles.text}>
          Take a clear picture of your VIN, or type it manually.
        </Text>

        {ocrIsLoading ? (
          <Text style={styles.wait}>
            AI is reading the image, please be patient...
          </Text>
        ) : null}

        {isUploading ? (
          <Text style={styles.wait}>
            Uploading the VIN image...
          </Text>
        ) : null}

        <TextInput
          style={styles.textInput}
          placeholder="VFX XXXXX XXXXXXXX"
          value={values.vin}
          mode="outlined"
          label="Vin"
          onChangeText={handleChange('vin')}
          right={<IconButton icon="edit" />}
        />
        {vinPicture ? <Image source={{ uri: Platform.OS === 'web' ? vinPicture.source.uri : `data:image/jpeg;base64,${vinPicture.source.base64}` }} style={styles.picture} />
          : null}

        <Text style={styles.orText}>OR</Text>
        <IconButton style={[styles.captureVinButton, { backgroundColor: theme.colors.primary }]} mode="contained" color="#FFF" icon={vinPicture ? 'reload' : 'camera'} onPress={handleOpenCamera} />

      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button onPress={handleSubmit} loading={isSubmittingVehicleInfo} style={styles.button} mode="contained" disabled={!values.vin || isSubmittingVehicleInfo} labelStyle={{ color: '#FFF' }}>
          Validate VIN
        </Button>
        <Button onPress={handleTakePictures} style={styles.button}>Skip</Button>
      </Card.Actions>
    </Card>
  );
}

VinForm.propTypes = {
  handleOpenCamera: PropTypes.func.isRequired,
  handleOpenGuide: PropTypes.func.isRequired,
  inspectionId: PropTypes.string.isRequired,
  isUploading: PropTypes.bool.isRequired,
  ocrIsLoading: PropTypes.bool.isRequired,
  vin: PropTypes.string.isRequired,
  vinPicture: propTypes.cameraPictures.isRequired,
};

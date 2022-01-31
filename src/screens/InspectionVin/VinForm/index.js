import React, { useCallback, useMemo } from 'react';
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
import handleStatuses from './statuses';

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

const payload = { market_value: { unit: 'EUR', value: 1 }, mileage: { value: 1, unit: 'km' } };

export default function VinForm({
  inspectionId,
  vin,
  handleOpenGuide,
  handleOpenCamera,
  vinPicture,
  ocrIsLoading,
  isUploading,
  status,
  requiredFields,
}) {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleTakePictures = useCallback(
    () => navigation.navigate(INSPECTION_CREATE, { inspectionId }),
    [inspectionId, navigation],
  );
  const { isLoading: isSubmittingVehicleInfo,
    request: submitVehicleInfo } = useRequest(null, {}, false);

  const requiredPayload = useMemo(() => {
    const hasMileage = requiredFields.mileage?.unit && requiredFields.mileage?.value;
    const hasMarketValue = requiredFields.marketValue?.unit && requiredFields.marketValue?.value;
    return { market_value: hasMarketValue ? requiredFields.marketValue : payload.market_value,
      mileage: hasMileage ? requiredFields.mileage : payload.mileage,
    };
  }, [requiredFields.marketValue, requiredFields.mileage]);

  const handleSkip = useCallback(() => submitVehicleInfo(updateOneInspectionVehicle({ inspectionId, data: { vin: '', ...requiredPayload } }),
    { onSuccess: handleTakePictures }),
  [submitVehicleInfo, inspectionId, requiredPayload, handleTakePictures]);

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { vin: vin || '' },
    enableReinitialize: true,
    onSubmit: (vals) => {
      submitVehicleInfo(updateOneInspectionVehicle({ inspectionId,
        data: { vin: vals.vin, ...requiredPayload } }),
      { onSuccess: handleTakePictures });
    },
  });

  const statusText = useMemo(
    () => handleStatuses({ status, ocrIsLoading, vinPicture, vin, values, isUploading }),
    [isUploading, ocrIsLoading, status, values, vin, vinPicture],
  );

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

        {statusText ? (
          <Text style={styles.wait}>
            {statusText}
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
        <IconButton disabled={vinPicture} style={[styles.captureVinButton, { backgroundColor: theme.colors.primary }]} mode="contained" color="#FFF" icon={vinPicture ? 'reload' : 'camera'} onPress={handleOpenCamera} />

      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button onPress={handleSubmit} style={styles.button} mode="contained" disabled={!values.vin || isSubmittingVehicleInfo} labelStyle={{ color: '#FFF' }}>
          Validate VIN
        </Button>
        <Button onPress={handleSkip} disabled={isSubmittingVehicleInfo} style={styles.button}>
          Skip
        </Button>
      </Card.Actions>
    </Card>
  );
}

VinForm.propTypes = {
  handleOpenCamera: PropTypes.func.isRequired,
  handleOpenGuide: PropTypes.func.isRequired,
  inspectionId: PropTypes.string,
  isUploading: PropTypes.bool.isRequired,
  ocrIsLoading: PropTypes.bool.isRequired,
  requiredFields: PropTypes.shape({
    marketValue: PropTypes.shape({
      unit: PropTypes.string,
      value: PropTypes.number,
    }),
    mileage: PropTypes.shape({
      unit: PropTypes.string,
      value: PropTypes.number,
    }),
  }).isRequired,
  status: PropTypes.string,
  vin: PropTypes.string,
  vinPicture: propTypes.cameraPictures,
};

VinForm.defaultProps = {
  inspectionId: null,
  vinPicture: null,
  vin: null,
  status: null,
};

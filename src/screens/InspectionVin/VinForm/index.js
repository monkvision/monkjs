import { updateOneInspectionVehicle } from '@monkvision/corejs';
import { useNavigation } from '@react-navigation/native';
import { spacing } from 'config/theme';
import { useFormik } from 'formik';
import useRequest from 'hooks/useRequest/index';
import useToggle from 'hooks/useToggle/index';
import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Button, Card, IconButton, TextInput, Title, useTheme } from 'react-native-paper';
import { INSPECTION_CREATE } from 'screens/names';
import handleStatuses from './statuses';

const styles = StyleSheet.create({
  card: {
    height: '100%',
    position: 'relative',
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  picture: {
    width: '100%',
    maxWidth: 512,
    height: 60,
    borderRadius: 4,
    marginTop: spacing(2),
    alignSelf: 'center',
  },
  textInputLayout: {
    width: '100%',
    alignSelf: 'center',
  },
  textInput: {
    width: '100%',
    alignSelf: 'center',
  },
  guideText: {
    textAlign: 'right',
    textDecorationLine: 'underline',
    marginBottom: spacing(1),
  },
  content: {
    marginVertical: spacing(3),
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
  title: {
    textAlign: 'center',
    marginTop: 20,
  },
  text: {
    marginVertical: spacing(2),
    textAlign: 'center',
  },
  lowContrast: {
    color: 'gray',
    textAlign: 'center',
  },
});

const payload = { market_value: { unit: 'EUR', value: 1 }, mileage: { value: 1, unit: 'km' } };

export default function VinForm({
  inspectionId,
  vin,
  handleOpenGuide,
  handleOpenCamera,
  handleOpenErrorSnackbar,
  handleRenitializeInspection,
  vinPicture,
  ocrIsLoading,
  isUploading,
  status,
  requiredFields,
}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isFocused, focus, blur] = useToggle();

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
    { onSuccess: handleTakePictures, onError: handleTakePictures }),
  [submitVehicleInfo, inspectionId, requiredPayload, handleTakePictures]);

  const { values, handleChange, handleSubmit, handleBlur, setFieldValue } = useFormik({
    initialValues: { vin: vin || '' },
    enableReinitialize: true,
    onSubmit: (vals) => {
      submitVehicleInfo(updateOneInspectionVehicle({ inspectionId,
        data: { vin: vals.vin, ...requiredPayload } }),
      { onSuccess: handleTakePictures, onError: handleOpenErrorSnackbar });
    },
  });

  const statusText = useMemo(
    () => handleStatuses({ status, ocrIsLoading, vinPicture, vin, values, isUploading }),
    [isUploading, ocrIsLoading, status, values, vin, vinPicture],
  );
  const handleOpenVinCameraOrRetake = useCallback(() => {
    if (vinPicture) {
      handleRenitializeInspection(null, { onSuccess: handleOpenCamera });
    } else { handleOpenCamera(); }
  }, [handleRenitializeInspection, handleOpenCamera, vinPicture]);

  return (
    <Card style={styles.card}>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View>
          <Title style={styles.title}>
            Set your vin
          </Title>

          <Text style={styles.text}>
            Take a clear picture of your VIN, or type it manually
          </Text>

          {statusText ? (
            <Text style={styles.lowContrast}>
              {statusText}
            </Text>
          ) : null}
        </View>

        <Card.Content style={styles.content}>
          <View style={styles.textInputLayout}>
            <TouchableOpacity onPress={handleOpenGuide}>
              <Text style={[styles.lowContrast, styles.guideText]}>Where to find?</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              mode="outlined"
              label="VIN"
              placeholder="VFX XXXXX XXXXXXXX"
              onChangeText={handleChange('vin')}
              onBlur={(e) => { handleBlur('vin')(e); blur(); }}
              onFocus={focus}
              value={values.vin}
              right={(
                <TextInput.Icon
                  name={!values.vin ? 'keyboard-outline' : 'backspace-outline'}
                  disabled={!isFocused}
                  onPress={() => setFieldValue('vin', '')}
                />
              )}
              render={(props) => (
                <TextInputMask
                  type="custom"
                  options={{ mask: 'SSS SSSSSS SSSSSSSS' }}
                  {...props}
                />
              )}
            />
          </View>

          {vinPicture ? <Image source={{ uri: vinPicture }} style={styles.picture} />
            : null}

          <Text style={styles.orText}>OR</Text>

          <IconButton style={[styles.captureVinButton, { backgroundColor: theme.colors.primary }]} mode="contained" color="#FFF" icon={vinPicture ? 'reload' : 'camera'} onPress={handleOpenVinCameraOrRetake} />
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button onPress={handleSubmit} style={styles.button} mode="contained" disabled={!values.vin || isSubmittingVehicleInfo} labelStyle={{ color: '#FFF' }}>
            Validate VIN
          </Button>

          <Button onPress={handleSkip} disabled={isSubmittingVehicleInfo} style={styles.button}>
            Skip
          </Button>
        </Card.Actions>
      </ScrollView>
    </Card>
  );
}

VinForm.propTypes = {
  handleOpenCamera: PropTypes.func,
  handleOpenErrorSnackbar: PropTypes.func,
  handleOpenGuide: PropTypes.func,
  handleRenitializeInspection: PropTypes.func,
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
  vinPicture: PropTypes.string,
};

VinForm.defaultProps = {
  handleOpenCamera: noop,
  handleOpenGuide: noop,
  handleOpenErrorSnackbar: noop,
  handleRenitializeInspection: noop,
  inspectionId: null,
  vinPicture: null,
  vin: null,
  status: null,
};

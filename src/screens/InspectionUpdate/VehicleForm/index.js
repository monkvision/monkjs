/* eslint-disable react/forbid-prop-types */
import React, { useCallback, useMemo } from 'react';
import omit from 'lodash.omit';
import noop from 'lodash.noop';
import snakeCase from 'lodash.snakecase';
import PropTypes from 'prop-types';
import { Avatar, Button, Card, RadioButton, Text, TextInput, useTheme, HelperText } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { Formik } from 'formik';

import { updateOneInspectionVehicle } from '@monkvision/corejs';
import { Select } from '@monkvision/react-native-views';

import { spacing } from 'config/theme';
import useRequest from 'hooks/useRequest';
import vehicleValidationSchema from './validation';

function renameKeys(obj, newKeys, callback = null) {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = callback ? callback(key) : (newKeys[key] || key);
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

const VEHICLE_TYPES = [
  { key: 'sedan', label: 'Sedan' },
  { key: 'hatchback', label: 'Hatchback' },
  { key: 'hot_hatch', label: 'Hot Hatch' },
  { key: 'suv', label: 'SUV' },
  { key: 'muc', label: 'Minivan' },
  { key: 'cuv', label: 'Crossover' },
  { key: 'sw', label: 'Station Wagon / Estate' },
  { key: 'gt', label: 'Grand Tourer' },
  { key: 'brake', label: 'Shooting Brake' },
  { key: 'coupe', label: 'Coupe' },
  { key: 'convertible', label: 'Convertible / Cabriolet' },
  { key: 'pony', label: 'Pony Car' },
  { key: 'pickup', label: 'Pickup Truck' },
  { key: 'ute', label: 'Utility' },
  { key: 'jeep', label: 'Jeep' },
  { key: 'super', label: 'Super / Hyper Car' },
  { key: 'hot_rod', label: 'Hot Rod' },
  { key: 'military', label: 'Military' },
];

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing(2),
    marginTop: spacing(2),
  },
  textInput: {
    width: '100%',
    marginBottom: spacing(1),
  },
  textInputLayout: {
    marginBottom: spacing(2),
  },
});
const unusedFields = ['additionalData', 'createdAt', 'deletedAt', 'id', 'objectType', 'ownerInfo', 'repairEstimate'];

const vehicleInfoInitialValues = {
  brand: '',
  model: '',
  plate: '',
  vehicle_type: '',
  mileage: {
    value: 1,
    unit: 'km',
  },
  market_value: {
    value: 1,
    unit: 'EUR',
  },
  vin: '',
  color: '',
  exterior_cleanliness: '',
  interior_cleanliness: '',
  date_of_circulation: '',
};

const CustomHelperText = ({ name, touched, errors, ...props }) => (
  <HelperText
    {...props}
    type="error"
    visible={errors[name]}
  >
    {errors[name]}
  </HelperText>
);

CustomHelperText.propTypes = {
  errors: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  touched: PropTypes.object.isRequired,
};

export default function VehicleForm({ inspection, refresh, inspectionId }) {
  const { colors } = useTheme();

  const { isLoading: isSubmittingVehicleInfo,
    request: submitVehicleInfo } = useRequest(null, {}, false);

  const normalizedVehicleInfo = useMemo(() => {
    const vehicleInfo = omit(inspection.vehicle, unusedFields);
    const normalizedInfos = renameKeys(vehicleInfo, null, (key) => snakeCase(key));

    const normalizedMarketValue = {
      unit: normalizedInfos.market_value.market_value_unit || '',
      value: normalizedInfos.market_value.market_value_value || '' };

    const mileage = {
      unit: normalizedInfos.mileage.mileage_unit || '',
      value: normalizedInfos.mileage.mileage_value || '' };

    const normalizedValues = { ...normalizedInfos, market_value: normalizedMarketValue, mileage };

    return Object.keys(normalizedValues).reduce((acc, key) => { acc[key] = normalizedValues[key] || ''; return acc; }, {});
  }, [inspection.vehicle]);

  const handleSubmitVehicleInfo = useCallback(
    (data) => submitVehicleInfo(updateOneInspectionVehicle({ inspectionId, data }),
      { onSuccess: refresh }),
    [inspectionId, refresh, submitVehicleInfo],
  );
  return (
    <Card style={styles.card}>
      <Formik
        validationSchema={vehicleValidationSchema}
        enableReinitialize
        initialValues={normalizedVehicleInfo || vehicleInfoInitialValues}
        onSubmit={(values) => handleSubmitVehicleInfo(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, dirty, errors }) => (
          <View style={styles.form}>
            <Card.Title
              title="Vehicle"
              left={(props) => <Avatar.Icon {...props} icon="car" />}
            />
            <Card.Content>

              <TextInput
                mode="outlined"
                label="Brand"
                placeholder="Toyota"
                onChangeText={handleChange('brand')}
                onBlur={handleBlur('brand')}
                value={values.brand}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Model"
                placeholder="Corolla"
                onChangeText={handleChange('model')}
                onBlur={handleBlur('model')}
                value={values.model}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="VIN"
                placeholder="VFX XXXXX XXXXXXXX"
                onChangeText={handleChange('vin')}
                onBlur={handleBlur('vin')}
                value={values.vin}
                style={styles.textInput}
                render={(props) => (
                  <TextInputMask
                    type="custom"
                    options={{ mask: 'SSS SSSSSS SSSSSSSS' }}
                    {...props}
                  />
                )}
              />

              <TextInput
                mode="outlined"
                label="License plate"
                placeholder="AA - 123 - AA"
                onChangeText={handleChange('plate')}
                onBlur={handleBlur('plate')}
                value={values.plate}
                style={styles.textInput}
                render={(props) => (
                  <TextInputMask
                    type="custom"
                    options={{ mask: 'AA - 999 - AA' }}
                    {...props}
                  />
                )}
              />

              <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
                <TextInput
                  mode="outlined"
                  type="number"
                  min={1}
                  label="Mileage"
                  onChangeText={handleChange('mileage.value')}
                  onBlur={handleBlur('mileage.value')}
                  value={values.mileage.value?.toString()}
                  style={[styles.textInput, { flexGrow: 1, width: 'auto' }]}
                  right={<TextInput.Affix text={values.mileage.unit} />}
                />

                <View style={{ alignItems: 'center', width: 75 }}>
                  <RadioButton.Group
                    onValueChange={handleChange('mileage.unit')}
                    value={values.mileage.unit}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Text>km</Text>
                      <RadioButton value="km" color={colors.primary} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text>mi</Text>
                      <RadioButton value="miles" color={colors.primary} />
                    </View>
                  </RadioButton.Group>
                </View>
              </View>

              <TextInput
                mode="outlined"
                label="Color"
                placeholder="Blue"
                onChangeText={handleChange('color')}
                onBlur={handleBlur('color')}
                value={values.color}
                style={styles.textInput}
              />

              <TextInput
                mode="outlined"
                label="Date of circulation"
                placeholder="2021/12/31"
                onChangeText={handleChange('date_of_circulation')}
                onBlur={handleBlur('date_of_circulation')}
                value={values.date_of_circulation}
                style={styles.textInput}
                render={(props) => (
                  <TextInputMask
                    type="datetime"
                    options={{ format: 'YYYY/MM/DD' }}
                    {...props}
                  />
                )}
              />

              <View style={{ marginBottom: spacing(2) }}>
                <Select
                  selectedValue={values.vehicle_type}
                  data={VEHICLE_TYPES}
                  style={{ left: 'auto', right: 20 }}
                  itemKey={(item) => item.key}
                  label={(item) => item.label}
                  onChange={(item) => handleChange('vehicle_type')(item.key)}
                  anchor={(openSelect) => (
                    <TextInput
                      mode="outlined"
                      editable={false}
                      label="Vehicle type"
                      placeholder="Sedan"
                      onBlur={handleBlur('vehicle_type')}
                      right={(
                        <TextInput.Icon
                          name="chevron-down"
                          onPress={openSelect}
                        />
                              )}
                      value={VEHICLE_TYPES.find((e) => (e.key === values.vehicle_type))?.label || ''}
                    />
                  )}
                />
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
                <TextInput
                  mode="outlined"
                  type="number"
                  min={1}
                  label="Market value"
                  onChangeText={handleChange('market_value.value')}
                  onBlur={handleBlur('market_value.value')}
                  value={values.market_value.value?.toString()}
                  style={[styles.textInput, { flexGrow: 1, width: 'auto' }]}
                  right={<TextInput.Affix text={values.market_value.unit} />}
                />

                <View style={{ alignItems: 'center', width: 75 }}>
                  <RadioButton.Group
                    onValueChange={handleChange('market_value.unit')}
                    value={values.market_value.unit}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Text>€EUR</Text>
                      <RadioButton value="EUR" color={colors.primary} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text>$USD</Text>
                      <RadioButton value="USD" color={colors.primary} />
                    </View>
                  </RadioButton.Group>
                </View>
              </View>
              <HelperText type="error" visible={errors?.mileage && errors?.mileage?.unit}>
                {errors?.mileage?.unit}
              </HelperText>
              <HelperText type="error" visible={errors?.mileage && errors?.mileage?.value}>
                {errors?.mileage?.value}
              </HelperText>
              <HelperText type="error" visible={errors?.market_value && errors?.market_value?.unit}>
                {errors?.market_value?.unit}
              </HelperText>
              <HelperText type="error" visible={errors?.market_value && errors?.market_value?.value}>
                {errors?.market_value?.value}
              </HelperText>
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
              <Button
                onPress={handleSubmit}
                icon="send"
                color={colors.success}
                loading={isSubmittingVehicleInfo}
                disabled={isSubmittingVehicleInfo || !dirty}
              >
                Submit
              </Button>
            </Card.Actions>
          </View>
        )}
      </Formik>
    </Card>

  );
}

VehicleForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  inspection: PropTypes.any,
  inspectionId: PropTypes.string,
  refresh: PropTypes.func,
};
VehicleForm.defaultProps = {
  inspection: {},
  refresh: noop,
  inspectionId: PropTypes.string,
};

import React, { useCallback, useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';

import moment from 'moment';
import useRequest from 'hooks/useRequest';
import { spacing } from 'config/theme';

import {
  getOneInspectionById,
  selectInspectionEntities,
  selectVehicleEntities,
  inspectionsEntity,
  vehiclesEntity,
} from '@monkvision/corejs';

import { Appbar, Avatar, Button, Card, IconButton, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import { ScrollView, SafeAreaView, View, StyleSheet } from 'react-native';
import { ActivityIndicatorView, Select } from '@monkvision/react-native-views';
import { TextInputMask } from 'react-native-masked-text';
import { Formik } from 'formik';

import { INSPECTION_READ } from 'screens/names';

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
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  card: {
    marginHorizontal: spacing(2),
    marginTop: spacing(2),
  },
  textInput: {
    width: '100%',
    marginBottom: spacing(2),
  },
});

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

const additionalInfoInitialValues = {
  agent_first_name: '',
  agent_last_name: '',
  agent_company: '',
  agent_company_city: '',
  vehicle_owner_first_name: '',
  vehicle_owner_last_name: '',
  vehicle_owner_address: '',
  vehicle_owner_phone: '',
  vehicle_owner_email: '',
  date_of_start: '',
  date_of_validation: '',
  comment: '',
};

export default () => {
  const route = useRoute();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { inspectionId } = route.params;

  const { isLoading } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const vehiclesEntities = useSelector(selectVehicleEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    vehicles: [vehiclesEntity],
  }, {
    inspections: inspectionEntities,
    vehicles: vehiclesEntities,
  });

  const handleGoBack = useCallback(
    () => navigation.navigate(INSPECTION_READ, { inspectionId }),
    [navigation, inspectionId],
  );

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        headerBackVisible: false,
        title: `Update inspection #${inspectionId.split('-')[0]}`,
        headerTitle: () => (
          <Appbar.Content
            color={colors.text}
            style={{ justifyContent: 'center' }}
            title="More information"
            subtitle={moment(inspection.createdAt).format('lll')}
          />
        ),
        headerLeft: () => (
          <Appbar.BackAction
            accessibilityLabel="Return to inspection"
            onPress={handleGoBack}
          />
        ),
        headerRight: () => (
          <IconButton
            accessibilityLabel="Update inspection"
            disabled
            icon="check"
            color={colors.primary}
          />
        ),
      });
    }
  }, [colors.primary, colors.text, handleGoBack, inspection.createdAt, inspectionId, navigation]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <Card style={styles.card}>
          <Formik
            initialValues={vehicleInfoInitialValues}
            onSubmit={(values) => console.log(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values }) => (
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
                      onChangeText={handleChange('Brand')}
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
                        value={values.mileage.value}
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
                            <RadioButton value="mi" color={colors.primary} />
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
                        value={values.market_value.value}
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

                  </Card.Content>
                  <Card.Actions style={{ justifyContent: 'flex-end' }}>
                    <Button
                      onPress={handleSubmit}
                      icon="send"
                      color={colors.success}
                    >
                      Submit
                    </Button>
                  </Card.Actions>
                </View>
            )}
          </Formik>
        </Card>

        <Card style={[styles.card, { marginBottom: spacing(2) }]}>
          <Formik
            initialValues={additionalInfoInitialValues}
            onSubmit={(values) => console.log(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
            }) => (
              <View style={styles.form}>
                <Card.Title
                  title="Additional info"
                  left={(props) => <Avatar.Icon {...props} icon="card-account-details" />}
                />
                <Card.Content>

                  <TextInput
                    mode="outlined"
                    label="ID"
                    value={inspectionId}
                    style={styles.textInput}
                    readOnly
                  />

                  <TextInput
                    mode="outlined"
                    label="Agent first name"
                    onChangeText={handleChange('agent_first_name')}
                    onBlur={handleBlur('agent_first_name')}
                    value={values.agent_first_name}
                    style={styles.textInput}
                  />

                  <TextInput
                    mode="outlined"
                    label="Agent last name"
                    onChangeText={handleChange('agent_last_name')}
                    onBlur={handleBlur('agent_last_name')}
                    value={values.agent_last_name}
                    style={styles.textInput}
                  />

                  <TextInput
                    mode="outlined"
                    label="Agent company"
                    onChangeText={handleChange('agent_company')}
                    onBlur={handleBlur('agent_company')}
                    value={values.agent_company}
                    style={styles.textInput}
                  />

                  <TextInput
                    mode="outlined"
                    label="Agent city"
                    onChangeText={handleChange('agent_company_city')}
                    onBlur={handleBlur('agent_company_city')}
                    value={values.agent_company_city}
                    style={styles.textInput}
                  />

                  <TextInput
                    mode="outlined"
                    label="Vehicle owner first name"
                    onChangeText={handleChange('vehicle_owner_first_name')}
                    onBlur={handleBlur('vehicle_owner_first_name')}
                    value={values.vehicle_owner_first_name}
                    style={styles.textInput}
                  />

                  <TextInput
                    mode="outlined"
                    label="Vehicle owner last name"
                    onChangeText={handleChange('vehicle_owner_last_name')}
                    onBlur={handleBlur('vehicle_owner_last_name')}
                    value={values.vehicle_owner_last_name}
                    style={styles.textInput}
                  />

                  <TextInput
                    mode="outlined"
                    label="Vehicle owner address"
                    onChangeText={handleChange('vehicle_owner_address')}
                    onBlur={handleBlur('vehicle_owner_address')}
                    value={values.vehicle_owner_address}
                    style={styles.textInput}
                  />

                  <TextInput
                    mode="outlined"
                    label="Vehicle owner phone"
                    onChangeText={handleChange('vehicle_owner_phone')}
                    onBlur={handleBlur('vehicle_owner_phone')}
                    value={values.vehicle_owner_phone}
                    style={styles.textInput}
                    render={(props) => (
                      <TextInputMask
                        type="cel-phone"
                        options={{
                          maskType: 'INTERNATIONAL',
                          withDDD: true,
                          dddMask: '(33) ',
                        }}
                        {...props}
                      />
                    )}
                  />

                  <TextInput
                    mode="outlined"
                    type="email"
                    label="Vehicle owner email"
                    onChangeText={handleChange('vehicle_owner_email')}
                    onBlur={handleBlur('vehicle_owner_email')}
                    value={values.vehicle_owner_email}
                    style={styles.textInput}
                  />

                  <TextInput
                    mode="outlined"
                    label="License date of start"
                    onChangeText={handleChange('date_of_start')}
                    onBlur={handleBlur('date_of_start')}
                    value={values.date_of_start}
                    style={styles.textInput}
                    render={(props) => (
                      <TextInputMask
                        type="datetime"
                        options={{ format: 'YYYY/MM/DD' }}
                        {...props}
                      />
                    )}
                  />

                  <TextInput
                    mode="outlined"
                    label="License date of validation"
                    onChangeText={handleChange('date_of_validation')}
                    onBlur={handleBlur('date_of_validation')}
                    value={values.date_of_validation}
                    style={styles.textInput}
                    render={(props) => (
                      <TextInputMask
                        type="datetime"
                        options={{ format: 'YYYY/MM/DD' }}
                        {...props}
                      />
                    )}
                  />

                </Card.Content>
                <Card.Actions style={{ justifyContent: 'flex-end' }}>
                  <Button
                    onPress={handleSubmit}
                    icon="send"
                    color={colors.success}
                  >
                    Submit
                  </Button>
                </Card.Actions>
              </View>
            )}
          </Formik>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
